const fs = require('fs');
const path = require('path');
const SiteBuilder = require('./build.js');

// Environment configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const BASE_URL = process.env.BASE_URL || '';

console.log(`🔧 Building for environment: ${NODE_ENV}`);
console.log(`🌐 Base URL: ${BASE_URL || 'relative paths'}`);

// Initialize the builder
const builder = new SiteBuilder();

// Helper function to load page content from files
function loadPageContent(pageName) {
    const pagePath = path.join('pages', `${pageName}.html`);
    if (fs.existsSync(pagePath)) {
        return fs.readFileSync(pagePath, 'utf8');
    }
    console.warn(`Page content not found: ${pagePath}`);
    return '';
}

// Function to replace basePath in content loaded from files
function processPageContent(content, basePath) {
    let processedContent = content.replace(/\{\{basePath\}\}/g, basePath);
    
    // Replace BASE_URL placeholders if environment variable is set
    if (BASE_URL) {
        processedContent = processedContent.replace(/\{\{baseUrl\}\}/g, BASE_URL);
        // Also replace relative paths with absolute URLs for assets in production
        if (NODE_ENV === 'production') {
            processedContent = processedContent.replace(/href="([^"]*\.(css|js))"/g, `href="${BASE_URL}/$1"`);
            processedContent = processedContent.replace(/src="([^"]*\.(js|jpg|jpeg|png|gif|svg|mp4))"/g, `src="${BASE_URL}/$1"`);
        }
    } else {
        processedContent = processedContent.replace(/\{\{baseUrl\}\}/g, '');
    }
    
    return processedContent;
}

// Build configuration for all pages
const pageConfigs = [
    // Home page
    {
        outputPath: 'index.html',
        pageTitle: 'Home',
        content: processPageContent(loadPageContent('home'), './')
    },

    // Blog listing page
    {
        outputPath: 'blog/index.html',
        pageTitle: 'Blogs',
        headerClass: 'defaultHeader',
        content: processPageContent(loadPageContent('blog-listing'), '../')
    },

    // Services pages
    {
        outputPath: 'services/index.html',
        pageTitle: 'Services',
        headerClass: 'defaultHeader',
        content: `
            <section class="accentColor2 text-center simple_banner">
                <div class="container">
                    <div class="small_container">
                        <span class="badge">Services</span>
                        <h1>Our <span class="highlighted">Services</span></h1>
                        <h5>Comprehensive technology solutions to accelerate your digital transformation journey.</h5>
                    </div>
                </div>
            </section>
            <section class="accentColor1">
                <div class="container">
                    <h1>Services Page</h1>
                    <p>This page will be developed with service offerings.</p>
                </div>
            </section>
        `
    },

    {
        outputPath: 'services/digital-product-development/index.html',
        pageTitle: 'Digital Product Development',
        headerClass: 'defaultHeader',
        content: processPageContent(loadPageContent('digital-product-development'), '../../')
    },

    {
        outputPath: 'services/mobile-development/index.html',
        pageTitle: 'Mobile Development',
        headerClass: 'defaultHeader',
        content: processPageContent(loadPageContent('mobile-development'), '../../')
    },

    {
        outputPath: 'services/web-development/index.html',
        pageTitle: 'Web Development',
        headerClass: 'defaultHeader',
        content: processPageContent(loadPageContent('web-development'), '../../')
    },

    {
        outputPath: 'services/IoT-Development/index.html',
        pageTitle: 'IoT Development',
        headerClass: 'defaultHeader',
        content: processPageContent(loadPageContent('iot-development'), '../../')
    },

    {
        outputPath: 'services/wap/index.html',
        pageTitle: 'Web Application Platform',
        headerClass: 'defaultHeader',
        content: `
            <section class="accentColor2 text-center simple_banner">
                <div class="container">
                    <div class="small_container">
                        <span class="badge">Services</span>
                        <h1>Web Application <span class="highlighted">Platform</span></h1>
                        <h5>Comprehensive platform solutions for modern web applications.</h5>
                    </div>
                </div>
            </section>
            <section class="accentColor1">
                <div class="container">
                    <h2>Web Application Platform Services</h2>
                    <p>Content to be developed...</p>
                </div>
            </section>
        `
    },

    // Industries page
    {
        outputPath: 'Industries/index.html',
        pageTitle: 'Industries',
        headerClass: 'defaultHeader',
        content: `
            <section class="accentColor2 text-center simple_banner">
                <div class="container">
                    <div class="small_container">
                        <span class="badge">Industries</span>
                        <h1>Industries We <span class="highlighted">Serve</span></h1>
                        <h5>Delivering specialized solutions across diverse industry verticals.</h5>
                    </div>
                </div>
            </section>
            <section class="accentColor1">
                <div class="container">
                    <div class="section_header">
                        <h2>Our Industry Expertise</h2>
                    </div>
                    <div class="custom-row">
                        <div class="custom-col-6">
                            <h3>Fintech</h3>
                            <p>Revolutionary financial technology solutions.</p>
                        </div>
                        <div class="custom-col-6">
                            <h3>Healthcare</h3>
                            <p>Digital health and telemedicine platforms.</p>
                        </div>
                        <div class="custom-col-6">
                            <h3>Retail & E-commerce</h3>
                            <p>Next-generation shopping experiences.</p>
                        </div>
                        <div class="custom-col-6">
                            <h3>EdTech</h3>
                            <p>Educational technology and learning platforms.</p>
                        </div>
                    </div>
                </div>
            </section>
        `
    }
];

// Generate blog post pages from the blogs.json
function generateBlogPages() {
    const blogsPath = 'js/blogs.json';
    if (fs.existsSync(blogsPath)) {
        const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
        
        blogs.forEach(blog => {
            // Extract the path from the URL
            const urlPath = blog.url.replace(/^\//, '').replace(/\/$/, '');
            const outputPath = `${urlPath}/index.html`;
            
            // Create a simple blog post page
            pageConfigs.push({
                outputPath: outputPath,
                pageTitle: blog.title,
                headerClass: 'defaultHeader',
                content: `
                    <section class="bannerV2 accentColor2 post_banner" style="background-image:url(${blog.featured_image});">
                        <div class="container">
                            <div class="small_container">
                                <span class="badge">Blog</span>
                                <h1>${blog.title}</h1>
                                <div class="post-meta">
                                    <span class="date">${new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    <span class="author">by ${blog.author}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="blog_post_content accentColor4">
                        <div class="container">
                            <div class="blog_post_flex">
                                <main class="main-content">
                                    <div class="post-body-byline">
                                        <div class="tags">
                                            ${blog.tags.map(tag => `<a href="/blog/?tag=${encodeURIComponent(tag)}" class="badge">${tag}</a>`).join(' ')}
                                        </div>
                                    </div>
                                    <article class="post-content">
                                        <h2>${blog.title}</h2>
                                        <p>${blog.summary}</p>
                                        <p><em>Full blog content would be loaded here from a separate content management system or markdown files.</em></p>
                                    </article>
                                    <a href="/blog" class="cm-btn btn2 backToBlog">
                                        <span class="btn-icon"></span>
                                        <span class="btn-text">Back to Blog</span>
                                    </a>
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

                    <section class="book_demo accentColor2">
                        <div class="container">
                            <div class="demo-card max-width-800">
                                <h3>Ready to Take Your Business to the Next Level?</h3>
                                <p>Let's explore how our custom technology solutions can drive real impact. Book a free consultation to discover how we can support your goals with innovation, expertise, and results-driven execution.</p>
                                <div class="btn-grid">
                                    <div class="btn-item">
                                        <a href="/contact-us" class="cm-btn">
                                            <span class="btn-text">Talk to an Expert</span>
                                            <span class="btn-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                                                    <path style="fill:currentColor;" d="m17.5 5.999-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.499l-6.5-6.5z" data-name="Right"></path>
                                                </svg>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                `,
                additionalScripts: `<script src="js/main.js"></script>`
            });
        });
    }
}

// Generate blog pages
generateBlogPages();

// Build all pages
console.log('Building Aexyn website...');
console.log(`Total pages to build: ${pageConfigs.length}`);

builder.buildPages(pageConfigs);

console.log('\n✅ Build complete!');
console.log('\nGenerated pages:');
pageConfigs.forEach(config => {
    console.log(`  - ${config.outputPath} (${config.pageTitle})`);
});

console.log('\n🚀 To serve locally, run: npm run serve');
console.log('📝 To rebuild, run: npm run build'); 