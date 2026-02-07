# Integrate New HTML Resources
1. Identify new HTML files to integrate (check for unregistered files)
2. Categorize each file by AWS service category
3. Move files to the CORRECT root-level category directory (NEVER scripts/html_management/)
4. For each file, ensure: fixed header with all nav links (including 自己紹介), sidebar TOC script, common.css link, prev/next navigation, WCAG AA compliance
5. Register files in data.js with correct metadata
6. Run update_counts.py to refresh category counts
7. Validate all files render correctly
8. Commit, push, and verify GitHub Pages deployment
