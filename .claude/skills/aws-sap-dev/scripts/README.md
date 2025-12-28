# Scripts Directory

## Important Note

The actual automation scripts for this repository are located in the main repository at:

- `/home/meme1/aws_sap_studying/scripts/html_management/`
- `/home/meme1/aws_sap_studying/scripts/quiz_management/`
- `/home/meme1/aws_sap_studying/scripts/accessibility/`

This skill references those scripts directly rather than duplicating them.

## Available Scripts

### HTML Management

- **integrate_new_html.py** - Automatically categorize and integrate new HTML files from new_html/ directory
- **add_breadcrumbs.py** - Add breadcrumb navigation to all HTML files
- **remove_breadcrumbs.py** - Remove breadcrumb navigation from HTML files
- **add_toc.py** - Add page-internal table of contents to HTML files

### Quiz Management

- **analyze_quiz.py** - Analyze quiz statistics and category distribution

### Accessibility

- **check_contrast_ratio.py** - Verify WCAG color contrast compliance
- **suggest_color_fixes.py** - Suggest accessible color alternatives

## Usage

Scripts are referenced in SKILL.md with full paths to the repository scripts directory. The skill does not duplicate these scripts to maintain a single source of truth.
