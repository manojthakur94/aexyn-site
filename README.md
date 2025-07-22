# Aexyn Website - Refactored Architecture

This project has been refactored to use a modern, component-based architecture that eliminates code duplication and makes the site much easier to maintain and scale.

## 🏗️ Architecture Overview

### Before Refactoring Issues:
- Header/footer duplicated across 25+ pages (500+ lines each)
- Manual path management for different directory levels
- No component reusability
- Difficult to maintain and update

### After Refactoring Benefits:
- **DRY Principle**: Single source of truth for all components
- **Automatic Path Resolution**: Smart base path calculation
- **Template System**: Consistent layouts across all pages
- **Easy Maintenance**: Update header/footer in one place
- **Scalable**: Add new pages quickly using templates

## 📁 New Directory Structure

```
├── components/           # Reusable HTML components
│   ├── head.html        # Common <head> content
│   ├── header.html      # Site header with navigation
│   ├── footer.html      # Site footer
│   └── scripts.html     # Common JavaScript imports
├── templates/           # Page templates
│   └── base.html        # Base page template
├── pages/              # Page-specific content (optional)
├── css/                # Stylesheets
├── js/                 # JavaScript files
├── images/             # Images and assets
├── build.js            # Build system
└── package.json        # Dependencies and scripts
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Site
```bash
npm run build
```

### 3. Serve Locally
```bash
npm run serve
```

### 4. Development Mode (Build + Serve)
```bash
npm run dev
```

## 🔧 How to Use

### Creating a New Page

1. **Create content** (can be inline or in a separate file):
```javascript
const aboutContent = `
  <section class="about-section">
    <div class="container">
      <h1>About Us</h1>
      <p>Your content here...</p>
    </div>
  </section>
`;
```

2. **Add to build configuration**:
```javascript
const builder = new SiteBuilder();
builder.buildPage({
  outputPath: 'about/index.html',
  pageTitle: 'About Us',
  headerClass: 'defaultHeader',
  content: aboutContent
});
```

3. **Run build**: `npm run build`

### Template Variables

All templates support these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{basePath}}` | Auto-calculated relative path to root | `./`, `../`, `../../` |
| `{{pageTitle}}` | Page title | `"About Us"` |
| `{{headerClass}}` | Additional header CSS classes | `"defaultHeader"` |
| `{{bodyClass}}` | Body CSS classes | `"class1 class2"` |
| `{{content}}` | Main page content | HTML content |
| `{{additionalHead}}` | Extra head tags | Meta tags, styles |
| `{{additionalScripts}}` | Extra scripts | Page-specific JS |

### Path Resolution

The system automatically calculates correct paths:
- `index.html` → `basePath = "./"`
- `blog/index.html` → `basePath = "../"`
- `blog/post/index.html` → `basePath = "../../"`

### Component Customization

Components support variables for customization:

**Header with different classes:**
```javascript
// Standard header
headerClass: ""

// Header for inner pages
headerClass: "defaultHeader"

// Header with custom styling
headerClass: "defaultHeader dark-theme"
```

## 📝 Migration Guide

### Converting Existing Pages

1. **Extract content sections** from existing HTML files
2. **Remove header/footer/head sections** (now in components)
3. **Add to build configuration** with appropriate variables
4. **Update internal links** to use `{{basePath}}` where needed

### Example Migration

**Before (blog/index.html):**
```html
<!DOCTYPE html>
<html>
<head>
  <!-- 15 lines of head content -->
</head>
<body>
  <header>
    <!-- 100+ lines of header -->
  </header>
  
  <main>
    <!-- Your actual content -->
  </main>
  
  <footer>
    <!-- 60+ lines of footer -->
  </footer>
  <!-- 10+ script tags -->
</body>
</html>
```

**After:**
```javascript
const blogContent = `
  <main>
    <!-- Your actual content -->
  </main>
`;

builder.buildPage({
  outputPath: 'blog/index.html',
  pageTitle: 'Blogs',
  headerClass: 'defaultHeader',
  content: blogContent
});
```

## 🎨 Styling and Assets

### CSS Organization
- Global styles remain in `css/style.css`
- Component-specific styles can be added to components
- Use CSS custom properties for theming

### Image Paths
All image paths in components use `{{basePath}}`:
```html
<img src="{{basePath}}images/logo.png" alt="Logo">
```

### JavaScript
- Common scripts are in `components/scripts.html`
- Page-specific scripts use `additionalScripts` variable

## 🔄 Build System Features

### Smart Path Resolution
- Automatically calculates relative paths based on output location
- No manual path configuration needed
- Works for any directory depth

### Component Caching
- Components are loaded once and reused
- Fast build times even with many pages

### Template Inheritance
- Base template provides consistent structure
- Easy to create specialized templates

### Variable Substitution
- Simple `{{variable}}` syntax
- Supports nested replacements
- Safe handling of missing variables

## 📊 Performance Benefits

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Code Duplication | 25+ copies of header/footer | 1 copy each | 95% reduction |
| Maintenance Time | Change 25+ files | Change 1 file | 96% faster |
| New Page Creation | Copy/paste 500+ lines | 10 lines of config | 98% faster |
| Build Time | Manual | Automated | Instant |

## 🛠️ Advanced Usage

### Custom Templates
Create specialized templates for different page types:

```html
<!-- templates/blog-post.html -->
<!DOCTYPE html>
<html>
<head>{{head}}</head>
<body>
  {{header}}
  <article class="blog-post">
    {{content}}
  </article>
  {{footer}}
  {{scripts}}
</body>
</html>
```

### Conditional Content
Use JavaScript logic in build script for dynamic content:

```javascript
const isProduction = process.env.NODE_ENV === 'production';
const analyticsScript = isProduction ? '<script>/* analytics */</script>' : '';

builder.buildPage({
  outputPath: 'index.html',
  additionalHead: analyticsScript,
  content: homeContent
});
```

### Bulk Page Generation
Generate multiple similar pages:

```javascript
const blogPosts = ['post1', 'post2', 'post3'];
const pages = blogPosts.map(post => ({
  outputPath: `blog/${post}/index.html`,
  pageTitle: `Blog Post: ${post}`,
  template: 'blog-post',
  content: loadBlogContent(post)
}));

builder.buildPages(pages);
```

## 🚨 Important Notes

1. **Build Required**: Always run `npm run build` after changes
2. **No Direct HTML Editing**: Edit components/templates, not generated files
3. **Path Variables**: Use `{{basePath}}` for all internal links in components
4. **Git Ignore**: Consider adding built files to `.gitignore` if you prefer

## 🔍 Troubleshooting

### Common Issues

**Paths not working:**
- Ensure you're using `{{basePath}}` in components
- Check that outputPath is correct

**Components not loading:**
- Verify component files exist in `components/` directory
- Check file names match exactly (case-sensitive)

**Build errors:**
- Run `node build.js` directly to see detailed error messages
- Ensure all required directories exist

### Debug Mode
Add debugging to build script:
```javascript
console.log('Building page:', config.outputPath);
console.log('Base path:', basePath);
console.log('Variables:', variables);
```

This architecture provides a solid foundation for scaling the website while maintaining clean, maintainable code. 