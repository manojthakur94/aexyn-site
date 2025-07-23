# Aexyn Site Architecture

## 🏗️ Clean Source/Generated File Structure

This site follows a **clean separation** between source files (that you edit) and generated files (created by the build process). This makes the codebase much more maintainable.

### 📁 Directory Structure

```
├── 📝 SOURCE FILES (edit these)
│   ├── blog/*/content.html          # Blog post content
│   ├── pages/*.html                 # Page content
│   ├── templates/*.html             # Page templates  
│   ├── components/*.html            # Reusable components (header, footer, etc.)
│   ├── js/blogs.json               # Blog metadata
│   └── css/, images/, js/           # Assets
│
├── 🏗️ GENERATED FILES (don't edit these)
│   ├── index.html                   # Generated home page
│   ├── blog/index.html             # Generated blog listing
│   ├── blog/*/index.html           # Generated blog posts
│   ├── services/*/index.html       # Generated service pages
│   └── Industries/index.html       # Generated industries page
│
└── 🔧 BUILD SYSTEM
    ├── build-site.js               # Main build script
    ├── build.js                    # Template engine
    └── scripts/maintain.js         # Maintenance utilities
```

### 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Serve locally
npm run serve

# Clean generated files
node scripts/maintain.js clean-generated
```

### ✏️ Editing Content

#### To edit a blog post:
1. Find the source file: `blog/{post-name}/content.html`
2. Edit the content sections
3. Run `npm run build` to regenerate

#### To edit a page:
1. Find the source file: `pages/{page-name}.html`
2. Edit the content
3. Run `npm run build` to regenerate

#### To edit shared components:
1. Edit files in `components/` (header.html, footer.html, etc.)
2. Run `npm run build` to regenerate all pages

### 🧹 Maintenance Commands

```bash
# List all source files
node scripts/maintain.js list-source

# List all generated files  
node scripts/maintain.js list-generated

# Verify the file structure
node scripts/maintain.js verify-structure

# Clean all generated files
node scripts/maintain.js clean-generated

# Show all available commands
node scripts/maintain.js help
```

### 📋 Adding a New Blog Post

1. **Add metadata** to `js/blogs.json`:
```json
{
  "id": 35,
  "title": "Your Blog Title",
  "featured_image": "images/your-image.jpeg",
  "date": "2025-01-15",
  "author": "Your Name", 
  "tags": ["YourTag"],
  "summary": "Brief description...",
  "url": "/blog/your-blog-slug/"
}
```

2. **Create content file** at `blog/your-blog-slug/content.html`:
```html
<section class="bannerV2 accentColor2 post_banner" style="background-image:url(images/your-image.jpeg);">
    <div class="container">
        <div class="small_container">
            <span class="badge">Blog</span>
            <h1>Your Blog Title</h1>
            <div class="post-meta">
                <span class="date">January 15, 2025</span>
                <span class="author">by Your Name</span>
            </div>
        </div>
    </div>
</section>

<section class="blog_post_content accentColor4">
    <div class="container">
        <div class="blog_post_flex">
            <main class="main-content">
                <article class="post-content">
                    <h2>Your Blog Title</h2>
                    <p>Your content here...</p>
                </article>
            </main>
            <aside class="sidebar">
                <div class="sticky-sidebar">
                    <div class="sidebar-widget">
                        <h3>Recent Posts</h3>
                        <div class="recent_posts_grid" id="recent-posts"></div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</section>
```

3. **Build the site**: `npm run build`

### 🎯 Benefits of This Architecture

- ✅ **No duplication**: Components are reused, not copied
- ✅ **Easy maintenance**: Edit once, applies everywhere  
- ✅ **Clear separation**: Source vs generated files are obvious
- ✅ **Fast builds**: Only reads source files, generates clean output
- ✅ **Git-friendly**: Only source files are committed
- ✅ **Scalable**: Easy to add new pages/blogs

### 🔧 Development Workflow

1. Edit source files (`blog/*/content.html`, `pages/*.html`, `components/*.html`)
2. Run `npm run build` to generate output
3. Test with `npm run serve`
4. Commit only source files (`.gitignore` handles the rest)

This architecture ensures your site remains clean, maintainable, and easy to work with! 🚀 