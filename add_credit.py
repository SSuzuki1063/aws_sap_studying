#!/usr/bin/env python3
import os
import re
from pathlib import Path

def add_github_credit(html_content):
    """Add GitHub credit footer to HTML content if not already present"""

    # Check if credit already exists
    if 'github.com/suzuki100603' in html_content.lower() or 'suzuki100603' in html_content:
        return html_content, False

    # Credit HTML to insert
    credit_html = '''
    <div style="text-align: center; padding: 20px; margin-top: 40px; border-top: 2px solid #E5E7EB; background-color: #F9FAFB;">
        <p style="color: #6B7280; font-size: 0.9em; margin: 0;">
            Created by <a href="https://github.com/suzuki100603" target="_blank" style="color: #FF9900; text-decoration: none; font-weight: 600;">suzuki100603</a>
        </p>
        <p style="color: #9CA3AF; font-size: 0.8em; margin: 5px 0 0 0;">
            AWS SAP Learning Resources
        </p>
    </div>
'''

    # Try to insert before closing body tag
    if '</body>' in html_content:
        html_content = html_content.replace('</body>', credit_html + '\n</body>')
        return html_content, True

    # If no body tag, try before closing html tag
    if '</html>' in html_content:
        html_content = html_content.replace('</html>', credit_html + '\n</html>')
        return html_content, True

    # If neither tag found, append at the end
    html_content += credit_html
    return html_content, True

def process_html_files(base_path):
    """Process all HTML files in the directory"""
    updated_count = 0
    skipped_count = 0
    error_count = 0

    # Find all HTML files
    html_files = list(Path(base_path).rglob('*.html'))

    print(f"Found {len(html_files)} HTML files")

    for html_file in html_files:
        try:
            # Read file
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Add credit
            new_content, modified = add_github_credit(content)

            if modified:
                # Write back
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                updated_count += 1
                print(f"Updated: {html_file.relative_to(base_path)}")
            else:
                skipped_count += 1
                print(f"Skipped (already has credit): {html_file.relative_to(base_path)}")

        except Exception as e:
            error_count += 1
            print(f"Error processing {html_file}: {e}")

    print(f"\n=== Summary ===")
    print(f"Total files: {len(html_files)}")
    print(f"Updated: {updated_count}")
    print(f"Skipped: {skipped_count}")
    print(f"Errors: {error_count}")

if __name__ == "__main__":
    base_path = "/home/suzuki100603/aws_sap"
    process_html_files(base_path)
