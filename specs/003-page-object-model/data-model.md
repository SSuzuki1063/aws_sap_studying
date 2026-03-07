# Data Model: Component Object Model + Regression Tests

**Date**: 2026-03-07

## Entity Diagram

```text
                    ┌─────────────────────┐
                    │     BasePage         │ abstract
                    │─────────────────────│
                    │ page: Page           │
                    │ pagePath: string     │ abstract
                    │ navbar: Navbar...    │ NEW
                    │ themeToggle: Theme...│ NEW
                    │ scrollToTop: Scroll..│ NEW
                    │─────────────────────│
                    │ goto()               │
                    │ waitForReady()       │ virtual
                    │ getAllLinks()         │
                    │ toggleTheme()        │ delegates to themeToggle
                    │ getTheme()           │ delegates to themeToggle
                    │ toggleNav()          │ delegates to navbar
                    └─────────┬───────────┘
                              │ extends
            ┌─────────────────┼─────────────────┐
            │                 │                 │
   ┌────────┴────────┐ ┌─────┴──────┐ ┌────────┴────────────┐
   │   IndexPage     │ │ConceptMap  │ │LearningResources    │
   │                 │ │   Page     │ │       Page           │
   │ search: Search..│ │            │ │ search: Search...    │
   │ hero, heroCards │ │ loadingMsg │ │ categoryNav, sidebar │
   │ statItems       │ │ filters    │ │ resourceList         │
   │                 │ │ breadcrumb │ │                      │
   │ searchFor()     │ │ clickL1()  │ │ getCategories()      │
   │ getHeroCards()  │ │ clickL2()  │ │ getResourceItems()   │
   │ getNavLinks()   │ │ navigateTo │ │ searchFor()          │
   └─────────────────┘ └────────────┘ └──────────────────────┘

   ┌──────────────────────────────────────────────────────────┐
   │              Component Objects (standalone)               │
   ├──────────────┬──────────────┬──────────────┬─────────────┤
   │NavbarComp.   │SearchComp.   │ThemeToggle   │ScrollToTop  │
   │              │              │  Comp.       │  Comp.      │
   │header        │searchInput   │toggleBtn     │button       │
   │hamburgerBtn  │searchClear   │              │             │
   │mainNav       │searchResults │toggleTheme() │scrollToTop()│
   │navLinks      │resultsCount  │getTheme()    │isVisible()  │
   │              │              │isDarkMode()  │             │
   │navigateTo()  │fill()        │              │             │
   │getLinks()    │clear()       │              │             │
   │openMobile()  │getCount()    │              │             │
   │closeMobile() │waitForResult │              │             │
   │isOpen()      │              │              │             │
   └──────────────┴──────────────┴──────────────┴─────────────┘
```

## Component Object Entities

### NavbarComponent

| Property | Type | Selector | Description |
|----------|------|----------|-------------|
| header | Locator | `.fixed-nav-header` | Fixed header element |
| hamburgerBtn | Locator | `#hamburgerBtn` | Mobile menu toggle button |
| mainNav | Locator | `#mainNav` | Navigation container |
| navLinks | Locator | `.fixed-nav-links a` | All navigation links |

| Method | Signature | Description |
|--------|-----------|-------------|
| navigateTo | (name: 'index' \| 'concept-map' \| 'learning-resources') => Promise<void> | Click nav link by page name |
| getLinks | () => Promise<Array<{text: string, href: string}>> | Get all nav link text+href |
| openMobile | () => Promise<void> | Open hamburger menu |
| closeMobile | () => Promise<void> | Close hamburger menu (click hamburger or press Escape) |
| isOpen | () => Promise<boolean> | Check if mobile nav is open (aria-expanded) |

### SearchComponent

| Property | Type | Selector | Description |
|----------|------|----------|-------------|
| input | Locator | `#searchInput` | Search text input |
| clearBtn | Locator | `#searchClear` | Clear search button |
| results | Locator | `#searchResults` | Results container |
| resultsCount | Locator | `#searchResultsCount` | Results count span |
| noResults | Locator | `#searchNoResults` | No-results message |

| Method | Signature | Description |
|--------|-----------|-------------|
| fill | (query: string) => Promise<void> | Type into search and wait for results |
| clear | () => Promise<void> | Click clear button |
| getResultCount | () => Promise<string> | Get the result count text |
| hasResults | () => Promise<boolean> | Check if results are visible |
| waitForResults | () => Promise<void> | Wait for results container to be visible |

### ThemeToggleComponent

| Property | Type | Selector | Description |
|----------|------|----------|-------------|
| toggleBtn | Locator | `.theme-toggle` | Theme toggle button |

| Method | Signature | Description |
|--------|-----------|-------------|
| toggle | () => Promise<void> | Click the toggle button |
| getTheme | () => Promise<string \| undefined> | Get `data-theme` attribute value |
| isDarkMode | () => Promise<boolean> | Returns true if theme is 'dark' |

### ScrollToTopComponent

| Property | Type | Selector | Description |
|----------|------|----------|-------------|
| button | Locator | `#scrollToTop` | Scroll-to-top button |

| Method | Signature | Description |
|--------|-----------|-------------|
| click | () => Promise<void> | Click the scroll-to-top button |
| isVisible | () => Promise<boolean> | Check if button is currently visible |
| waitForVisible | () => Promise<void> | Wait for button to appear |

## Relationships

```text
BasePage *--1 NavbarComponent      (composition)
BasePage *--1 ThemeToggleComponent  (composition)
BasePage *--1 ScrollToTopComponent  (composition)
IndexPage *--1 SearchComponent     (composition, page-specific search)
LearningResourcesPage *--1 SearchComponent  (composition)
ConceptMapPage: no SearchComponent (uses concept-specific search, different selectors)
```

## State Transitions

### Theme State
```text
[light] --toggleTheme()--> [dark] --toggleTheme()--> [light]
Persisted in: localStorage('theme') + html[data-theme]
```

### Mobile Nav State
```text
[closed] --openMobile()--> [open] --closeMobile()--> [closed]
                                  --Escape key-->    [closed]
                                  --resize >768px--> [closed]
Tracked by: #hamburgerBtn[aria-expanded], #mainNav.mobile-open
```

### Search State
```text
[empty] --fill(query)--> [has-results] --clear()--> [empty]
                     \--> [no-results]  --clear()--> [empty]
Tracked by: #searchInput.value, #searchResults visibility
```
