# Architecture Documentation

This document provides detailed architecture information for the AWS SAP study resource repository.

## Overview

This is a fully static website with NO backend server, NO database, NO build process. All content is served as static HTML/CSS/JavaScript files that work completely offline.

**Important Architecture Note:**
This is NOT a typical table-of-contents.html based static site. The repository has two different navigation systems:
1. **`index.html`** - Main dynamic navigation page (THIS is the primary navigation, NOT table-of-contents.html)
2. **`table-of-contents.html`** - Static reference page for quick browsing (secondary, manually maintained)

When adding resources, `index.html` must be updated (automatically by `integrate_new_html.py` or manually via `data.js`).

## Navigation System

- `index.html` serves as the main entry point with a collapsible sidebar navigation
- Each category in the sidebar dynamically loads HTML content using iframe injection
- JavaScript functions handle category expansion/collapse and content loading

## Content Structure

Each HTML file is a self-contained learning module with:
- Embedded SVG diagrams and technical illustrations
- Step-by-step explanations with numbered sections
- AWS CLI examples and code snippets
- Responsive CSS using AWS brand colors (#232F3E, #FF9900)
- Japanese language content optimized for Japanese learners

## Technical Implementation

### Main Navigation (index.html)

- Dynamic content loading via iframe injection with `loadContent(filename)` function
- Sidebar collapse/expand functionality with CSS transitions and localStorage persistence
- Mobile-responsive with hamburger menu toggle for small screens
- Search functionality with real-time filtering across all resources
- Category accordion system with single-expand behavior (closes others when opening one)
- No external dependencies - completely offline-capable learning platform

Key JavaScript functions in index.html:
- `toggleCategory(categoryId)` - Handles category accordion expansion/collapse
- `loadContent(filename)` - Loads HTML content into iframe with error handling
- `performSearch(query)` - Filters and displays search results from searchData array
- `clearSearch()` - Clears search input and hides results
- `toggleSidebarCollapse()` - Desktop sidebar collapse with localStorage persistence
- `toggleMobileMenu()` - Mobile hamburger menu toggle
- `loadQuiz()` - Opens quiz.html in new tab

### Data-Driven Architecture (index.html Refactor)

**Recent Refactor (2025)**: The main `index.html` page has been refactored into a data-driven architecture that separates data, rendering logic, and UI interactions.

**File Structure:**
```
index.html          ← Shell page with HTML structure
├── data.js         ← Pure data definitions (NO HTML)
├── render.js       ← Template functions (data → HTML)
└── index.js        ← UI event handlers (search, scroll, etc.)
```

**Core Data Structures (data.js):**
- `categoriesData` - Array of major categories with sections and resources
- `categoryQuickNav` - Quick navigation links data
- `searchData` - Search index for all resources (**MUST be updated when adding resources**)

**Template Functions (render.js):**
- `renderCategoryQuickNav(navData)` - Generates quick navigation HTML
- `renderResourceList(resources)` - Generates resource list HTML
- `renderSection(section)` - Generates section (subcategory) HTML
- `renderMajorCategory(category)` - Generates major category HTML
- `renderAllCategories(categoriesData)` - Generates all categories HTML
- `renderQuickNavToDOM(containerId, data)` - Renders to specific DOM element
- `renderCategoriesToDOM(containerId, data)` - Renders categories to DOM

**Critical Workflow: Adding New Resources**

When adding a new HTML learning resource, you **MUST** update **TWO** places:

1. **Update `data.js`:**
   ```javascript
   // Add to appropriate section's resources array
   {
     title: 'New Resource Title',
     href: 'category/new-resource.html'
   }
   // Also update section.count and category.count
   ```

2. **Update `index.js`:**
   ```javascript
   // Add to searchData array (search won't work without this!)
   const searchData = [
     // ... existing entries ...
     {
       title: 'New Resource Title',
       category: 'カテゴリ名',
       file: 'category/new-resource.html'
     }
   ];
   ```

**Why This Architecture?**
1. **Maintainability**: Content changes don't risk breaking HTML structure
2. **Consistency**: Single template ensures uniform output
3. **Scalability**: Adding content = adding data objects
4. **Testability**: Data and rendering are separate concerns
5. **Error Prevention**: Automated tag generation prevents HTML errors

**Important**: The `integrate_new_html.py` script does NOT automatically update `data.js` or `searchData` in `index.js`. These must be updated manually when adding resources.

### Knowledge Base Interface

The `knowledge-base.html` file provides an alternative navigation interface:
- **Table-based layout** for quick browsing of all resources
- **Advanced filtering** by category, service, or keyword
- **Sortable columns** for different organization views
- **Complements index.html** - different UX for resource discovery
- **Same offline-first design** - no external dependencies

### Resource Search System

The site includes a comprehensive search functionality for finding learning resources:

**Search Features:**
- **Real-time search**: Results filter automatically as you type
- **Search scope**: Searches across all 120+ resource titles and categories
- **Keyboard shortcuts**:
  - `Enter` - Execute search
  - `Escape` - Clear search and reset results
- **Visual feedback**: Search results count, category badges, and "no results" message
- **Responsive design**: Grid layout adapts to screen size

**Search Data Structure (defined in index.js):**
```javascript
const searchData = [
  {
    title: 'Resource Title',
    category: 'Category Name',
    file: 'path/to/resource.html'
  },
  // ... 120+ entries covering all resources
];
```

**CRITICAL**: When adding new resources via `scripts/html_management/integrate_new_html.py` or manually, the `searchData` array in `index.js` must be updated to include the new resource. The script does NOT automatically update the search data. Without this update, the resource will not appear in search results.

**Search Implementation:**
- Location: Positioned between statistics section and category navigation
- Styling: Green gradient design (`#F0FDF4` to `#DCFCE7`) with AWS brand accent colors
- Results: Grid layout with category badges, max height with scrolling
- Clear button: Appears when search input has text, clicking resets search

### Category Quick Navigation

- Category quick links section added below statistics section on index.html
- Each major category has an ID anchor for in-page navigation:
  - `#networking` - ネットワーキング
  - `#security-governance` - セキュリティ・ガバナンス
  - `#compute-applications` - コンピュート・アプリケーション
  - `#content-delivery-dns` - コンテンツ配信・DNS
  - `#development-deployment` - 開発・デプロイメント
  - `#storage-database` - ストレージ・データベース
  - `#migration-transfer` - 移行・転送
  - `#analytics-operations` - 分析・運用・クイズ
- Smooth scroll behavior implemented via CSS `scroll-behavior: smooth`
- 8 category cards with icons, names, and resource counts
- Hover animations with color transitions and shadow effects

### Breadcrumb Navigation

- All HTML learning resource pages include breadcrumb navigation
- Breadcrumbs show: Home > Major Category > Sub Category
- Link back to index.html for easy navigation
- Consistent styling with AWS brand colors

### Page-Internal Table of Contents (TOC)

- All learning resource pages include a collapsible table of contents
- Automatically generated from h2 and h3 heading tags
- Features:
  - Expandable/collapsible with toggle button
  - **Default state: collapsed (folded)** - Users must click to expand
  - **Right-aligned positioning** on desktop (max-width: 400px)
  - Full-width display on mobile devices (screen width < 768px)
  - Smooth scroll navigation to heading anchors
  - Automatic ID generation for headings
  - Mobile-responsive design
  - Blue gradient styling matching AWS brand
  - Positioned after breadcrumb navigation or first h1 tag
- Implementation: Inline CSS and JavaScript for offline capability
- UI Controls:
  - Toggle button shows `▶ 展開する` when collapsed
  - Toggle button shows `▼ 折りたたむ` when expanded
  - Smooth CSS transitions for expand/collapse animations

### Quiz System

- Interactive quiz application (`quiz.html`, `quiz-app.js`, `quiz-data-extended.js`)
- Category-based question selection across 13 AWS domains
- Real-time scoring and feedback with explanations
- Progress tracking with visual progress bar
- **Quiz Progress Tracking**: The `QuizProgress` class in `quiz-app.js` provides localStorage-based progress tracking functionality. It saves quiz scores, dates, and performance metrics per category. This feature is implemented but not exposed in the UI by default - it can be enabled by adding UI controls to view saved progress data.
- Responsive design for all device sizes

Quiz data structure in `quiz-data-extended.js`:
```javascript
const quizData = {
  'category-key': {
    title: 'Category Title',
    icon: 'emoji',
    questions: [
      {
        id: 'unique-id',
        question: 'Question text',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correct: 0, // Index of correct answer
        explanation: 'Detailed explanation'
      }
    ]
  }
}

// Helper functions (defined at bottom of quiz-data-extended.js)
function getTotalQuestions(categoryKey) { ... }  // Returns question count for category
function getAllQuestions(categoryKey) { ... }   // Returns copy of all questions for category
```

## File Patterns

- HTML files use descriptive naming: `aws-[service]-[topic].html` or `[service]_[topic]_infographic.html`
- All content is static HTML/CSS/JavaScript with no external dependencies
- SVG graphics are inline for offline accessibility
- CSS uses AWS brand colors: `#232F3E` (dark blue), `#FF9900` (orange)

## Design Constraints & Philosophy

### Static Site Architecture

**CRITICAL**: This is a fully static website with NO backend server, NO database, NO build process.

- **No Node.js/npm**: No package.json, no npm install, no webpack/vite/parcel
- **No external dependencies**: All CSS/JS must be inline or in local files
- **No CDNs**: No loading from external URLs for offline capability
- **Pure HTML/CSS/JavaScript**: Everything runs client-side in the browser
- **Python server is for development only**: The `server.py` script is ONLY for local testing with CORS support. The deployed site on GitHub Pages serves static files directly.

### Offline-First Design

All resources must work without internet:
- SVG diagrams embedded inline in HTML files
- No external image URLs or font CDNs
- No API calls or external data fetching
- JavaScript is vanilla JS with no framework dependencies

### Why This Architecture?

1. **Zero deployment complexity**: Push to gh-pages = instant deployment
2. **Perfect offline study**: Download repo and study anywhere
3. **Fast loading**: No build step, no bundling, instant page loads
4. **Educational clarity**: Students can view source and learn web development basics
5. **Maximum portability**: Works on any web server, USB drive, or local filesystem

## Browser Compatibility

- Designed for modern browsers with CSS Grid and Flexbox support
- Mobile-responsive with breakpoints at 768px and 1024px
- Touch-friendly targets on mobile devices (44px minimum)

## Content Language

- All content is in Japanese (日本語)
- File paths and code use English
- Comments and explanations in learning materials are in Japanese

## Performance Considerations

- Each HTML file should be self-contained to minimize HTTP requests
- SVG graphics should be inline rather than external files
- Avoid external dependencies (CDNs, external CSS/JS) for offline capability
- Large infographic files are acceptable as they're loaded on-demand via iframe
- Search is client-side only - no backend processing required
