#!/usr/bin/env python3
"""
generate_concept_index.py — AWS概念マップ インデックス生成スクリプト

概念JSONファイル (concepts/) を走査して以下を自動生成する:
  - concepts/concept-index.json : ナビゲーション・O(1)参照用メタデータ索引
  - concepts/search-index.json  : 検索用フラット配列（name_ja/en, description_ja, sap_tip, tags）

Usage:
  python3 scripts/concept_management/generate_concept_index.py
  python3 scripts/concept_management/generate_concept_index.py --validate
  python3 scripts/concept_management/generate_concept_index.py --dry-run
"""

import argparse
import json
import sys
from datetime import date
from pathlib import Path


class Colors:
    RESET  = "\033[0m"
    GREEN  = "\033[92m"
    YELLOW = "\033[93m"
    RED    = "\033[91m"
    CYAN   = "\033[96m"

def ok(msg):   print(f"{Colors.GREEN}✓{Colors.RESET} {msg}")
def warn(msg): print(f"{Colors.YELLOW}⚠{Colors.RESET}  {msg}")
def err(msg):  print(f"{Colors.RED}✗{Colors.RESET} {msg}", file=sys.stderr)
def info(msg): print(f"{Colors.CYAN}→{Colors.RESET} {msg}")


class ConceptIndexGenerator:
    """concepts/ を走査して concept-index.json と search-index.json を生成する。"""

    def __init__(self):
        self.repo_root    = Path(__file__).parent.parent.parent
        self.concepts_dir = self.repo_root / "concepts"
        self.public_dir   = self.repo_root / "public" / "concepts"
        self.errors       = []
        self.warnings     = []

    def _iter_source_files(self):
        for subdir in ("axes", "domains", "services"):
            d = self.concepts_dir / subdir
            if not d.exists():
                warn(f"  ディレクトリが存在しません: {d.relative_to(self.repo_root)}")
                continue
            for p in sorted(d.glob("*.json")):
                yield subdir, p

    def _load_json(self, path):
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            self.errors.append(f"{path.name}: JSON パースエラー — {e}")
            return None

    def _validate_required(self, data, path):
        for f in ["id", "layer", "type", "name_ja", "name_en", "description_ja"]:
            if f not in data:
                self.errors.append(f"{path.name}: 必須フィールド '{f}' が存在しません")

    def _validate_id_prefix(self, data, path):
        prefixes = {"axis": "axis-", "domain": "dom-", "service": "svc-",
                    "concept": "con-", "keyword": "kw-"}
        ntype = data.get("type", "")
        nid   = data.get("id", "")
        exp   = prefixes.get(ntype, "")
        if exp and not nid.startswith(exp):
            self.errors.append(f"{path.name}: ID '{nid}' は '{exp}' で始まる必要があります")

    def _validate_crosslinks(self, data, path, all_ids):
        for cl in data.get("crosslinks", []):
            if cl.get("type") in ("axis_tag", "sap_tag"):
                self.errors.append(
                    f"{path.name}: crosslinks[type='{cl['type']}'] は禁止。"
                    " axis_tags/sap_domains フィールドを使用してください"
                )
            tid = cl.get("target_id", "")
            if tid and tid not in all_ids:
                self.warnings.append(
                    f"{path.name}: crosslinks.target_id '{tid}' がインデックスに存在しません"
                )

    def _concept_index_entry(self, data, rel_file=""):
        entry = {
            "id":          data.get("id", ""),
            "layer":       data.get("layer", -1),
            "type":        data.get("type", ""),
            "name_ja":     data.get("name_ja", ""),
            "name_en":     data.get("name_en", ""),
            "axis_tags":   data.get("axis_tags", []),
            "sap_domains": data.get("sap_domains", []),
            "tags":        data.get("tags", []),
        }
        if data.get("type") == "service":
            if rel_file:
                entry["file"] = rel_file
            if data.get("parent_domain_id"):
                entry["parent_domain_id"] = data["parent_domain_id"]
        return entry

    def _search_entry(self, data):
        return {
            "id":             data.get("id", ""),
            "layer":          data.get("layer", -1),
            "type":           data.get("type", ""),
            "name_ja":        data.get("name_ja", ""),
            "name_en":        data.get("name_en", ""),
            "description_ja": data.get("description_ja", ""),
            "sap_tip":        data.get("sap_tip", ""),
            "axis_tags":      data.get("axis_tags", []),
            "sap_domains":    data.get("sap_domains", []),
            "tags":           data.get("tags", []),
        }

    def _expand_service(self, svc, ci_entries, sr_entries):
        for concept in svc.get("key_concepts", []):
            ci_entries.append(self._concept_index_entry(concept))
            sr_entries.append(self._search_entry(concept))
            for kw in concept.get("keywords", []):
                ci_entries.append(self._concept_index_entry(kw))
                sr_entries.append(self._search_entry(kw))

    def generate(self, validate=False, dry_run=False):
        info("concepts/ ディレクトリを走査しています...")

        ci_entries = []
        sr_entries = []
        all_ids    = set()

        source_files = list(self._iter_source_files())

        # パス1: 全IDを収集（crosslink検証用）
        for _sub, path in source_files:
            data = self._load_json(path)
            if not data:
                continue
            all_ids.add(data.get("id", ""))
            for c in data.get("key_concepts", []):
                all_ids.add(c.get("id", ""))
                for kw in c.get("keywords", []):
                    all_ids.add(kw.get("id", ""))

        # パス2: エントリ生成 + 検証
        seen_ids = {}
        for _sub, path in source_files:
            data = self._load_json(path)
            if not data:
                continue

            if validate:
                self._validate_required(data, path)
                self._validate_id_prefix(data, path)
                self._validate_crosslinks(data, path, all_ids)

            nid = data.get("id", "")
            if nid in seen_ids:
                self.errors.append(
                    f"ID重複: '{nid}' が {seen_ids[nid]} と {path.name} の両方に存在"
                )
            seen_ids[nid] = path.name

            rel_file = str(path.relative_to(self.concepts_dir))
            ci_entries.append(self._concept_index_entry(data, rel_file))
            sr_entries.append(self._search_entry(data))

            if data.get("type") == "service":
                self._expand_service(data, ci_entries, sr_entries)

        if self.errors:
            err(f"\n{len(self.errors)} 件のエラー:")
            for e in self.errors:
                err(f"  • {e}")
            return False

        if self.warnings:
            warn(f"\n{len(self.warnings)} 件の警告:")
            for w in self.warnings:
                warn(f"  • {w}")

        if dry_run:
            info(f"[Dry-run] concept-index: {len(ci_entries)} ノード, search-index: {len(sr_entries)} エントリ")
            ok("Dry-run 完了（ファイル書き込みなし）")
            return True

        ci_json = json.dumps({
            "version":     "1.0.0",
            "generated":   date.today().isoformat(),
            "total_nodes": len(ci_entries),
            "nodes":       ci_entries,
        }, ensure_ascii=False, indent=2)
        sr_json = json.dumps(sr_entries, ensure_ascii=False, indent=2)

        (self.concepts_dir / "concept-index.json").write_text(ci_json, encoding="utf-8")
        ok(f"concept-index.json 生成完了（{len(ci_entries)} ノード）")

        (self.concepts_dir / "search-index.json").write_text(sr_json, encoding="utf-8")
        ok(f"search-index.json 生成完了（{len(sr_entries)} エントリ）")

        # public/ にも同期（Astro ビルドで配信されるディレクトリ）
        if self.public_dir.exists():
            (self.public_dir / "concept-index.json").write_text(ci_json, encoding="utf-8")
            (self.public_dir / "search-index.json").write_text(sr_json, encoding="utf-8")
            ok("public/concepts/ にも同期完了")

        return True


def main():
    parser = argparse.ArgumentParser(
        description="AWS概念マップ インデックス生成スクリプト",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  python3 scripts/concept_management/generate_concept_index.py
  python3 scripts/concept_management/generate_concept_index.py --validate
  python3 scripts/concept_management/generate_concept_index.py --dry-run
        """,
    )
    parser.add_argument("--validate", action="store_true",
                        help="ID一意性・必須フィールド・crosslinksターゲット存在確認")
    parser.add_argument("--dry-run", action="store_true",
                        help="ファイルを書き込まずに走査結果のみ表示")
    args = parser.parse_args()

    gen = ConceptIndexGenerator()
    return 0 if gen.generate(validate=args.validate, dry_run=args.dry_run) else 1


if __name__ == "__main__":
    sys.exit(main())
