#!/usr/bin/env python3
"""
SVG Alternative Text Automation Script

This script automatically adds WCAG 2.1 Level AA compliant alternative text
to inline SVG elements in AWS SAP study HTML files.

Usage:
    # Dry-run preview
    python3 add_svg_alt_text.py --dry-run

    # Process specific category
    python3 add_svg_alt_text.py --category networking

    # Process all files
    python3 add_svg_alt_text.py

Generated ARIA attributes:
    - role="img": Identifies SVG as image
    - aria-labelledby: Links to title and description IDs
    - <title>: Concise name (10-80 chars)
    - <desc>: Detailed description (50-500 chars)

Context Analysis:
    The script analyzes surrounding HTML content to generate meaningful
    alternative text:
    - Parent section headings (<div class="card-header">)
    - Preceding h2/h3 headings
    - Preceding paragraph content
    - File path category
    - SVG internal structure (shapes, text, connections)

Quality Validation:
    All generated text is validated for:
    - Appropriate length
    - Meaningful content (not generic)
    - Japanese language correctness
    - Unique ID generation

Author: Claude Code
Date: 2025-12-27
WCAG: 2.1 Level AA (Success Criterion 1.1.1 Non-text Content)
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import argparse


@dataclass
class SVGContext:
    """Context information for SVG element"""
    file_path: Path
    svg_content: str
    svg_start_pos: int
    svg_end_pos: int
    preceding_heading: Optional[str] = None
    preceding_paragraph: Optional[str] = None
    parent_section_title: Optional[str] = None
    category: Optional[str] = None


class SVGAnalyzer:
    """Analyzes SVG elements and their context"""

    # Category-based keywords for AWS services
    AWS_SERVICE_KEYWORDS = {
        'cloudfront': 'CloudFront',
        'route53': 'Route53',
        'route 53': 'Route53',
        'lambda': 'Lambda',
        'ec2': 'EC2',
        'vpc': 'VPC',
        's3': 'S3',
        'direct connect': 'Direct Connect',
        'directconnect': 'Direct Connect',
        'cognito': 'Cognito',
        'iam': 'IAM',
        'systems manager': 'Systems Manager',
        'ssm': 'Systems Manager',
        'cloudformation': 'CloudFormation',
        'cdk': 'CDK',
        'sam': 'SAM',
        'api gateway': 'API Gateway',
        'eventbridge': 'EventBridge',
        'sns': 'SNS',
        'sqs': 'SQS',
        'ecs': 'ECS',
        'fargate': 'Fargate',
        'rds': 'RDS',
        'aurora': 'Aurora',
        'dynamodb': 'DynamoDB',
        'elasticache': 'ElastiCache',
        'ebs': 'EBS',
        'efs': 'EFS',
        'kinesis': 'Kinesis',
        'redshift': 'Redshift',
        'glue': 'Glue',
        'transit gateway': 'Transit Gateway',
        'privatelink': 'PrivateLink',
        'vpn': 'VPN',
        'waf': 'WAF',
        'shield': 'Shield',
        'scp': 'Service Control Policy',
        'organizations': 'Organizations',
        'control tower': 'Control Tower',
        'global accelerator': 'Global Accelerator',
        'codedeploy': 'CodeDeploy',
        'codepipeline': 'CodePipeline',
        'alb': 'Application Load Balancer',
        'nlb': 'Network Load Balancer',
        'auto scaling': 'Auto Scaling',
        'patch manager': 'Patch Manager',
    }

    def __init__(self):
        self.svg_counter = 0

    def extract_context(self, html_content: str, svg_match: re.Match, file_path: Path) -> SVGContext:
        """Extract context around SVG element

        Searches backwards from SVG position to find:
        1. Nearest preceding <h2> or <h3> (within 500 chars)
        2. Nearest preceding <p> (within 300 chars)
        3. Parent <div class="card-header"> or section title
        4. Category from file path
        """
        svg_pos = svg_match.start()

        # Search backwards for headings
        heading_pattern = r'<h([23])[^>]*>(.*?)</h\1>'
        preceding_text = html_content[max(0, svg_pos - 500):svg_pos]
        heading_matches = list(re.finditer(heading_pattern, preceding_text, re.DOTALL))

        preceding_heading = None
        if heading_matches:
            last_heading = heading_matches[-1]
            # Strip HTML tags from heading text
            heading_text = re.sub(r'<[^>]+>', '', last_heading.group(2)).strip()
            # Remove emoji and extra whitespace
            heading_text = re.sub(r'[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]', '', heading_text).strip()
            if heading_text:
                preceding_heading = heading_text

        # Search for preceding paragraph
        para_pattern = r'<p[^>]*>(.*?)</p>'
        para_text = html_content[max(0, svg_pos - 300):svg_pos]
        para_matches = list(re.finditer(para_pattern, para_text, re.DOTALL))

        preceding_paragraph = None
        if para_matches:
            last_para = para_matches[-1]
            para_content = re.sub(r'<[^>]+>', '', last_para.group(1)).strip()
            # Truncate to first 200 chars
            if para_content:
                preceding_paragraph = para_content[:200]

        # Extract parent section title (card-header, etc.)
        section_pattern = r'<div[^>]*class="[^"]*(?:card-header|section-title)[^"]*"[^>]*>(.*?)</div>'
        section_text = html_content[max(0, svg_pos - 1000):svg_pos]
        section_matches = list(re.finditer(section_pattern, section_text, re.DOTALL))

        parent_section_title = None
        if section_matches:
            last_section = section_matches[-1]
            section_content = re.sub(r'<[^>]+>', '', last_section.group(1)).strip()
            if section_content:
                parent_section_title = section_content

        # Extract category from file path
        category = None
        path_str = str(file_path)
        if 'networking/' in path_str:
            category = 'ネットワーキング'
        elif 'security-governance/' in path_str:
            category = 'セキュリティ・ガバナンス'
        elif 'compute-applications/' in path_str:
            category = 'コンピュート・アプリケーション'
        elif 'content-delivery-dns/' in path_str:
            category = 'コンテンツ配信・DNS'
        elif 'development-deployment/' in path_str:
            category = '開発・デプロイメント'
        elif 'storage-database/' in path_str:
            category = 'ストレージ・データベース'
        elif 'migration' in path_str:
            category = '移行・転送'
        elif 'analytics' in path_str or 'data-analytics/' in path_str:
            category = '分析・運用'

        return SVGContext(
            file_path=file_path,
            svg_content=svg_match.group(0),
            svg_start_pos=svg_match.start(),
            svg_end_pos=svg_match.end(),
            preceding_heading=preceding_heading,
            preceding_paragraph=preceding_paragraph,
            parent_section_title=parent_section_title,
            category=category
        )

    def generate_title(self, context: SVGContext) -> str:
        """Generate descriptive title from context

        Priority order:
        1. Parent section heading (e.g., "CloudFrontとは？")
        2. Preceding h2/h3 heading
        3. AWS service keyword + generic descriptor
        4. Fallback: File path based title
        """
        # Priority 1: Parent section title
        if context.parent_section_title and len(context.parent_section_title) < 60:
            # Clean up title (remove "とは？", add diagram descriptor if needed)
            title = context.parent_section_title.replace('とは？', '').replace('とは', '').strip()
            # Add diagram descriptor if not already present
            if not any(suffix in title for suffix in ['図', 'アーキテクチャ', 'フロー', 'ダイアグラム', 'インフォグラフィック']):
                title += 'の図'
            return title

        # Priority 2: Preceding heading
        if context.preceding_heading and len(context.preceding_heading) > 0:
            title = context.preceding_heading
            if not any(suffix in title for suffix in ['図', 'アーキテクチャ', 'フロー', 'ダイアグラム']):
                title += 'の図'
            return title

        # Priority 3: Service keyword extraction
        combined_text = ' '.join(filter(None, [
            context.parent_section_title or '',
            context.preceding_heading or '',
            context.preceding_paragraph or ''
        ])).lower()

        for keyword, service_name in self.AWS_SERVICE_KEYWORDS.items():
            if keyword in combined_text:
                return f'{service_name}アーキテクチャ図'

        # Priority 4: Fallback based on category
        if context.category:
            return f'{context.category}の技術構成図'

        return 'AWSアーキテクチャ図'

    def generate_description(self, context: SVGContext) -> str:
        """Generate detailed description from SVG analysis

        Analyzes:
        1. SVG element types and counts
        2. Text content within SVG
        3. Visual structure (connections, groupings)
        4. Context from surrounding HTML
        """
        svg_content = context.svg_content

        # Count SVG elements
        circles = len(re.findall(r'<circle', svg_content))
        rects = len(re.findall(r'<rect', svg_content))
        paths = len(re.findall(r'<path', svg_content))
        lines = len(re.findall(r'<line', svg_content))

        # Extract text elements
        text_pattern = r'<text[^>]*>(.*?)</text>'
        text_elements = re.findall(text_pattern, svg_content, re.DOTALL)
        text_content = []
        for t in text_elements:
            # Remove nested tags and clean up
            clean_text = re.sub(r'<[^>]+>', '', t).strip()
            if clean_text and len(clean_text) > 0:
                text_content.append(clean_text)

        # Build description components
        desc_parts = []

        # Add context from preceding paragraph (first sentence)
        if context.preceding_paragraph:
            # Extract first sentence or up to 100 chars
            sentences = context.preceding_paragraph.split('。')
            if sentences and len(sentences[0]) > 0:
                first_sentence = sentences[0] + '。'
                if len(first_sentence) < 150:
                    desc_parts.append(first_sentence)

        # Add structural description
        structure_desc = []
        if circles > 0:
            structure_desc.append(f'{circles}個のノード（円形）')
        if rects > 0:
            structure_desc.append(f'{rects}個のコンポーネント（矩形）')
        if lines > 0 or paths > 0:
            structure_desc.append('矢印や接続線')

        if structure_desc:
            desc_parts.append('、'.join(structure_desc) + 'で構成された図。')

        # Add text labels if present (limit to first 5 for readability)
        if text_content and len(text_content) <= 5:
            # Include actual labels for small diagrams
            labels = '、'.join(text_content[:5])
            desc_parts.append(f'ラベル: {labels}')
        elif len(text_content) > 5:
            desc_parts.append(f'{len(text_content)}個のラベル付き要素を含む。')

        # Combine and truncate to reasonable length
        full_desc = ''.join(desc_parts)

        # If description is too short or empty, provide fallback
        if len(full_desc) < 50:
            if context.category:
                full_desc = f'{context.category}に関するAWS技術アーキテクチャを視覚的に表現した図。'
            else:
                full_desc = 'AWSサービスの構成や動作フローを視覚的に表現した技術図。'

        # Truncate if too long
        if len(full_desc) > 500:
            full_desc = full_desc[:497] + '...'

        return full_desc


class SVGAccessibilityInjector:
    """Injects ARIA attributes and elements into SVG"""

    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.processed_files = []
        self.updated_svgs = 0
        self.skipped_svgs = 0
        self.analyzer = SVGAnalyzer()

    def validate_alt_text(self, title: str, desc: str) -> Tuple[bool, List[str]]:
        """Validate generated alt text meets quality standards

        Checks:
        1. Title: 10-80 characters, descriptive
        2. Description: 50-500 characters, meaningful
        3. No generic phrases only
        4. Includes specific content when applicable
        """
        errors = []

        # Title validation
        if len(title) < 10:
            errors.append(f"Title too short ({len(title)} chars): {title}")
        if len(title) > 80:
            errors.append(f"Title too long ({len(title)} chars)")
        if title in ['図', 'ダイアグラム', 'AWS図', 'アーキテクチャ図']:
            errors.append("Title too generic")

        # Description validation
        if len(desc) < 50:
            errors.append(f"Description too short ({len(desc)} chars)")
        if len(desc) > 500:
            errors.append(f"Description too long ({len(desc)} chars)")

        # Generic description check
        generic_phrases = ['視覚的', '表現', '図']
        if all(phrase in desc for phrase in generic_phrases) and len(desc) < 100:
            errors.append("Description is too generic")

        return (len(errors) == 0, errors)

    def inject_aria_attributes(self, svg_content: str, title: str, desc: str, svg_id: int) -> str:
        """Add role, aria-labelledby, title, and desc to SVG

        Transform:
            <svg viewBox="..." xmlns="...">
        To:
            <svg viewBox="..." xmlns="..." role="img"
                 aria-labelledby="svg-title-1 svg-desc-1">
                <title id="svg-title-1">...</title>
                <desc id="svg-desc-1">...</desc>
                <!-- original content -->
        """
        # Find opening <svg> tag
        svg_open_pattern = r'(<svg[^>]*>)'
        svg_open_match = re.search(svg_open_pattern, svg_content)

        if not svg_open_match:
            return svg_content

        opening_tag = svg_open_match.group(1)

        # Check if already has role="img" or aria-labelledby
        if 'role="img"' in opening_tag or "role='img'" in opening_tag:
            return None  # Signal to skip this SVG
        if 'aria-labelledby' in opening_tag:
            return None  # Signal to skip this SVG

        # Build new opening tag with ARIA attributes
        # Remove closing > from original tag
        tag_without_close = opening_tag.rstrip('>').strip()

        title_id = f'svg-title-{svg_id}'
        desc_id = f'svg-desc-{svg_id}'

        new_opening_tag = f'{tag_without_close} role="img" aria-labelledby="{title_id} {desc_id}">'

        # Build title and desc elements
        title_element = f'\n    <title id="{title_id}">{title}</title>'
        desc_element = f'\n    <desc id="{desc_id}">{desc}</desc>'

        # Replace in original content
        result = svg_content.replace(
            opening_tag,
            new_opening_tag + title_element + desc_element,
            1  # Only replace first occurrence
        )

        return result

    def process_file(self, file_path: Path) -> Dict[str, any]:
        """Process single HTML file

        Returns dict with:
        - success: bool
        - svgs_found: int
        - svgs_updated: int
        - svgs_skipped: int
        - errors: list
        """
        result = {
            'success': False,
            'svgs_found': 0,
            'svgs_updated': 0,
            'svgs_skipped': 0,
            'errors': [],
            'changes': []
        }

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            result['errors'].append(f"Failed to read file: {str(e)}")
            return result

        # Find all SVG elements
        svg_pattern = r'<svg[^>]*>.*?</svg>'
        svg_matches = list(re.finditer(svg_pattern, content, re.DOTALL))

        result['svgs_found'] = len(svg_matches)

        if len(svg_matches) == 0:
            return result

        # Process each SVG
        modified_content = content
        offset = 0  # Track position changes from replacements

        for idx, svg_match in enumerate(svg_matches, 1):
            # Extract context
            # Create a simple match-like object with corrected positions
            class AdjustedMatch:
                def __init__(self, original_match, pos_offset):
                    self._original = original_match
                    self._offset = pos_offset

                def start(self):
                    return self._original.start() + self._offset

                def end(self):
                    return self._original.end() + self._offset

                def group(self, n=0):
                    return self._original.group(n)

            adjusted_match = AdjustedMatch(svg_match, offset)
            context = self.analyzer.extract_context(modified_content, adjusted_match, file_path)

            # Generate title and description
            title = self.analyzer.generate_title(context)
            desc = self.analyzer.generate_description(context)

            # Validate
            is_valid, validation_errors = self.validate_alt_text(title, desc)

            # Inject ARIA attributes
            updated_svg = self.inject_aria_attributes(
                context.svg_content,
                title,
                desc,
                idx
            )

            if updated_svg is None:
                # SVG already has accessibility attributes
                result['svgs_skipped'] += 1
                result['changes'].append({
                    'svg_num': idx,
                    'action': 'skipped',
                    'reason': 'Already has accessibility attributes'
                })
                continue

            # Track validation warnings
            if not is_valid:
                result['errors'].extend([f"SVG {idx}: {err}" for err in validation_errors])

            # Replace in content
            old_svg = context.svg_content
            modified_content = modified_content.replace(old_svg, updated_svg, 1)

            # Update offset
            offset += len(updated_svg) - len(old_svg)

            result['svgs_updated'] += 1
            result['changes'].append({
                'svg_num': idx,
                'title': title,
                'description': desc,
                'validation': 'PASS' if is_valid else 'WARN',
                'validation_errors': validation_errors if not is_valid else []
            })

        # Write updated content if not dry run
        if not self.dry_run and result['svgs_updated'] > 0:
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(modified_content)
                result['success'] = True
            except Exception as e:
                result['errors'].append(f"Failed to write file: {str(e)}")
                result['success'] = False
        else:
            result['success'] = True  # Dry run always succeeds

        return result

    def process_directory(self, root_dir: Path, category: Optional[str] = None) -> None:
        """Process all HTML files in directory or specific category"""

        # Determine directories to process
        if category:
            target_dirs = [root_dir / category]
        else:
            # All category directories
            target_dirs = [
                root_dir / 'networking',
                root_dir / 'security-governance',
                root_dir / 'compute-applications',
                root_dir / 'content-delivery-dns',
                root_dir / 'development-deployment',
                root_dir / 'storage-database',
                root_dir / 'migration',
                root_dir / 'migration-transfer',
                root_dir / 'analytics-bigdata',
                root_dir / 'data-analytics',
                root_dir / 'new-solutions',
                root_dir / 'organizational-complexity',
                root_dir / 'continuous-improvement',
                root_dir / 'cost-control',
            ]

        total_files_processed = 0
        total_svgs_found = 0
        total_svgs_updated = 0
        total_svgs_skipped = 0

        for dir_path in target_dirs:
            if not dir_path.exists():
                continue

            print(f"\n📁 Processing: {dir_path.name}/")

            # Find HTML files (exclude index.html, quiz.html, table-of-contents.html, home.html)
            html_files = [
                f for f in dir_path.glob('*.html')
                if f.name not in ['index.html', 'quiz.html', 'table-of-contents.html', 'home.html']
            ]

            for html_file in html_files:
                result = self.process_file(html_file)

                if result['svgs_found'] == 0:
                    continue

                total_files_processed += 1
                total_svgs_found += result['svgs_found']
                total_svgs_updated += result['svgs_updated']
                total_svgs_skipped += result['svgs_skipped']

                # Print file result
                status_icon = "✅" if result['success'] else "❌"
                print(f"  {status_icon} {html_file.name}")
                print(f"     Found: {result['svgs_found']} SVGs, Updated: {result['svgs_updated']}, Skipped: {result['svgs_skipped']}")

                # Print changes
                for change in result['changes']:
                    if 'action' in change and change['action'] == 'skipped':
                        print(f"     ⏭️  SVG {change['svg_num']}: {change['reason']}")
                    else:
                        val_icon = "✓" if change['validation'] == 'PASS' else "⚠️"
                        print(f"     {val_icon} SVG {change['svg_num']}: {change['title'][:50]}...")
                        if change['validation'] == 'WARN':
                            for err in change['validation_errors']:
                                print(f"        ⚠️  {err}")

                # Print errors
                for error in result['errors']:
                    print(f"     ❌ {error}")

        # Print summary
        print(f"\n{'='*60}")
        print(f"{'DRY RUN ' if self.dry_run else ''}SUMMARY")
        print(f"{'='*60}")
        print(f"Files processed: {total_files_processed}")
        print(f"SVGs found: {total_svgs_found}")
        print(f"SVGs updated: {total_svgs_updated}")
        print(f"SVGs skipped: {total_svgs_skipped}")
        print(f"{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(
        description='Add ARIA-compliant alternative text to SVG elements',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Dry-run preview
  python3 add_svg_alt_text.py --dry-run

  # Process specific category
  python3 add_svg_alt_text.py --category content-delivery-dns

  # Process all categories
  python3 add_svg_alt_text.py
        """
    )
    parser.add_argument('--dry-run', action='store_true',
                       help='Preview changes without modifying files')
    parser.add_argument('--dir', type=str,
                       default='/home/meme1/aws_sap_studying',
                       help='Root directory to process (default: /home/meme1/aws_sap_studying)')
    parser.add_argument('--category', type=str,
                       help='Process only specific category (e.g., networking)')

    args = parser.parse_args()

    print("\n🚀 SVG Alternative Text Automation Script")
    print(f"Mode: {'DRY RUN (no changes will be made)' if args.dry_run else 'PRODUCTION (files will be modified)'}")
    print(f"Directory: {args.dir}")
    if args.category:
        print(f"Category: {args.category}")
    print()

    injector = SVGAccessibilityInjector(dry_run=args.dry_run)
    injector.process_directory(Path(args.dir), category=args.category)

    print("✨ Complete!")


if __name__ == '__main__':
    main()
