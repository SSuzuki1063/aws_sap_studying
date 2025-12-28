# Coding Standards

This document defines coding standards and development principles for the AWS SAP study resource repository.

## Data-Driven Development Principles

When writing code for this repository, **STRICTLY ADHERE** to the following rules to maintain separation of concerns and code maintainability:

### Rule 1: HTML Structure Preservation

**DO NOT modify HTML structure** (header, main, section, footer, and other semantic tags).
- Existing HTML tag hierarchy must remain unchanged
- No reorganization of DOM structure
- Preserve semantic HTML5 structure

### Rule 2: No Manual HTML Tag Manipulation

**DO NOT add, remove, or change nesting of HTML tags manually**.
- No inserting new `<div>`, `<section>`, `<article>` tags
- No deleting existing structural tags
- No changing parent-child relationships between tags

### Rule 3: Content as Pure Data

**ALL content must be defined as JavaScript data structures** (arrays, objects).
- Content lives in separate data files (e.g., `data.js`, `quiz-data-extended.js`)
- Use objects and arrays to represent content hierarchies
- Keep data files focused on data only, not presentation logic

### Rule 4: Single Template Function Pattern

**HTML generation must happen in ONE centralized template function**.
- Create a single rendering function that consumes data
- All HTML output is generated programmatically from this function
- No scattered HTML generation across multiple files

### Rule 5: No Manual Closing Tags

**DO NOT manually write closing tags** - let template functions handle them.
- Template functions should automatically generate matching closing tags
- Use template literals or DOM methods that enforce proper tag closure
- Prevent unclosed tag bugs through automated generation

### Rule 6: Pure Data in Data Files

**data.js and similar files must contain ONLY pure data** - no HTML tags.
- No HTML strings embedded in data objects
- Content as plain text, numbers, or structured objects
- Markdown acceptable for simple formatting if processed programmatically

## Example: Correct Data-Driven Pattern

### ❌ WRONG - HTML mixed with data:

```javascript
// data.js
const content = {
  title: '<h2>AWS Lambda</h2>',
  description: '<p>Serverless compute service</p>'
};
```

### ✅ CORRECT - Pure data with template function:

```javascript
// data.js (pure data only)
const content = {
  title: 'AWS Lambda',
  description: 'Serverless compute service'
};

// render.js (single template function)
function renderContent(data) {
  return `
    <h2>${data.title}</h2>
    <p>${data.description}</p>
  `;
}
```

## Benefits of This Approach

1. **Maintainability**: Data changes don't risk breaking HTML structure
2. **Scalability**: Adding new content is as simple as adding data objects
3. **Testability**: Data and rendering logic can be tested independently
4. **Separation of Concerns**: Content editors work with data, developers work with templates
5. **Consistency**: Single template ensures uniform HTML structure across all content
6. **Error Prevention**: Automated tag generation eliminates unclosed tag bugs

## When These Rules Apply

### ALWAYS apply these rules when:

- Adding new quiz questions to `quiz-data-extended.js`
- Creating new learning content
- Modifying existing content
- Building new features that render dynamic content

### Exceptions (these are static files, rules don't apply):

- Editing individual HTML learning resource files (`aws-*.html`)
- Modifying `index.html` navigation structure (must be done carefully)
- Updating static pages like `home.html`, `table-of-contents.html`

## Code Review Checklist

Before committing code changes, verify:

- [ ] No HTML tags present in data files
- [ ] Content defined as pure JavaScript objects/arrays
- [ ] Single template function handles all HTML generation
- [ ] No manual HTML structure modifications
- [ ] Closing tags generated automatically by template function
- [ ] Data and presentation logic are completely separated

## File Naming Conventions

### HTML Learning Resources

- **Preferred**: `aws-[service]-[topic].html`
  - Example: `aws-lambda-metrics.html`
  - Example: `aws-direct-connect-guide.html`

- **Alternative**: `[service]_[topic]_infographic.html`
  - Example: `ecs_infographic.html`
  - Example: `auto_scaling_infographic.html`

### JavaScript Files

- Use lowercase with hyphens for multi-word names
- Example: `quiz-data-extended.js`
- Example: `data.js`, `render.js`, `index.js`

### Python Scripts

- Use snake_case for Python files
- Example: `integrate_new_html.py`
- Example: `add_breadcrumbs.py`

## CSS Standards

### Color Palette

Use AWS brand colors consistently:

- **Primary Dark**: `#232F3E` (AWS dark blue)
- **Accent Orange**: `#FF9900` (AWS orange)
- **Text Gray**: `#374151` (dark gray for readable text)
- **Background**: `#F9FAFB` (light gray for backgrounds)
- **Border**: `#E5E7EB` (medium gray for borders)

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Minimum Touch Targets

- **Mobile buttons/links**: 44px minimum height/width
- Ensures accessibility on touch devices

## JavaScript Standards

### Vanilla JavaScript Only

- **NO frameworks**: No React, Vue, Angular, etc.
- **NO build tools**: No webpack, vite, parcel
- **NO package managers**: No npm, yarn, pnpm
- Use pure ES6+ JavaScript features

### Function Naming

- Use camelCase for function names
- Use descriptive names that indicate purpose
- Examples:
  - `renderCategoryQuickNav()`
  - `performSearch()`
  - `toggleSidebarCollapse()`

### Data Structures

- Use `const` for immutable data
- Use `let` only when reassignment is necessary
- Prefer object and array literals over constructors

## HTML Standards

### DOCTYPE and Language

Always include:
```html
<!DOCTYPE html>
<html lang="ja">
```

### Semantic HTML

Use semantic tags appropriately:
- `<article>` for independent content
- `<section>` for grouped content
- `<nav>` for navigation
- `<header>` and `<footer>` for page structure
- `<main>` for main content

### Accessibility

- Always include `alt` attributes on `<img>` tags
- Use ARIA labels where appropriate
- Ensure keyboard navigation works
- Maintain proper heading hierarchy (h1 → h2 → h3)

## SVG Standards

### Inline SVGs

- Always embed SVGs inline (not as external files)
- Ensures offline capability
- Makes graphics searchable and accessible

### SVG Attributes

- Include `role="img"` for accessibility
- Include `aria-label` for screen readers
- Optimize SVG code (remove unnecessary metadata)

## Documentation Standards

### Code Comments

- Use comments sparingly - code should be self-documenting
- Only comment complex logic or non-obvious decisions
- Keep comments in Japanese for consistency with content

### File Headers

Include headers in JavaScript files:
```javascript
// AWS SAP学習リソース - [File Purpose]
// このファイルは[description]
```

## Performance Standards

### File Size Limits

- Individual HTML files: No strict limit (content-driven)
- JavaScript files: Keep under 100KB when possible
- SVG files: Optimize but prioritize clarity over size

### Loading Strategy

- Inline critical CSS
- Defer non-critical JavaScript
- Use lazy loading for images when appropriate
- Minimize HTTP requests (all resources inline)

## Security Standards

### No External Resources

- **NO CDNs**: All resources must be local
- **NO external APIs**: No runtime API calls
- **NO third-party scripts**: Pure first-party code only

### Content Security

- Sanitize any user-generated content (quiz inputs)
- Use `sandbox` attributes on iframes appropriately
- No inline event handlers in HTML (use addEventListener)

## Testing Standards

### Manual Testing Requirements

Before committing changes:

1. **Local server test**: `python3 server.py`
2. **Browser testing**: Chrome, Firefox, Safari
3. **Mobile testing**: Use browser dev tools responsive mode
4. **W3C validation**: All HTML must pass validation
5. **Console check**: No JavaScript errors in console

### Regression Testing

When modifying core functionality:
- Test navigation works across all categories
- Test search finds all resources
- Test quiz functionality end-to-end
- Test mobile responsive behavior
