# Repository Guidelines

## Project Structure & Module Organization
- Root `index.html` is the main navigator; update its sidebar links whenever content changes.
- Topic folders: `networking/`, `transit-gateway-sharing/`, `security-governance/`, `compute-applications/`, `content-delivery-dns/`, and `development-deployment/` hold standalone HTML infographics with embedded SVG.
- Place new resources in the matching topic folder; use descriptive, lowercase filenames such as `aws-[service]-[topic].html` or `[service]_[topic]_infographic.html`.
- Keep content bilingual where applicable and reuse existing layout blocks to stay consistent.

## Build, Test, and Development Commands
- No build step required for the static site; open `index.html` directly in a browser.
- Run a lightweight local server to avoid file:// quirks: `python -m http.server 8000` and browse `http://localhost:8000/`.
- Spot unintended external dependencies: `rg "http" <file>` should only return intra-site links.
- Optional linting: `tidy -errors file.html` to catch malformed markup before sharing.

## Coding Style & Naming Conventions
- Use clear HTML with 4-space indentation; follow the existing AWS palette (`#232F3E`, `#FF9900`) and typography choices in `index.html`.
- Prefer semantic elements (`<section>`, `<h2>`, lists) and concise copy in Japanese/English.
- Embed SVG diagrams inline; avoid external scripts, fonts, or CDN assets to preserve offline use.
- Keep filenames and IDs lowercase with hyphens/underscores only; mirror topic names in headings and alt text for searchability.

## Testing Guidelines
- Open each new or changed page in the browser to confirm it loads offline with no console errors and that diagrams render correctly.
- Verify navigation: ensure the sidebar link in `index.html` points to the new file and that internal anchors work.
- If layout changes span browsers, sanity-check in Chrome and Firefox; note any differences in the PR.

## Commit & Pull Request Guidelines
- Use conventional commits as in history (`feat:`, `docs:`, `chore:`) with short, action-focused summaries.
- PRs should list changed files, affected AWS domain/topic, navigation updates, and manual test steps; include screenshots for visual changes.
- Link related issues/tasks when available and state any follow-up work needed (e.g., translations or additional diagrams).

## Security & Offline Expectations
- Keep resources self-contained: no external CDN links, tracking pixels, or embedded credentials.
- Redact sensitive details (account IDs, ARNs, keys) in examples and diagrams before merging.
