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

// Function to format blog date
function formatBlogDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return dateString; // Return original if parsing fails
    }
}

// Function to generate blog tags HTML
function generateBlogTags(tags) {
    if (!Array.isArray(tags)) {
        tags = [tags];
    }

    return tags.map(tag => {
        const encodedTag = encodeURIComponent(tag);
        return `<a href="/blog/?tag=${encodedTag}" class="badge">${tag}</a>`;
    }).join('\n                            ');
}

// Function to build blog pages using template
function buildBlogPages() {
    const blogsPath = 'js/blogs.json';
    if (!fs.existsSync(blogsPath)) {
        console.warn(`Blog data file not found: ${blogsPath}`);
        return;
    }

    try {
        const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));

        console.log(`📝 Building ${blogs.length} blog pages...`);

        blogs.forEach(blog => {
            const urlPath = blog.url.replace(/^\//, '').replace(/\/$/, '');
            const contentFilePath = `${urlPath}/content.html`;
            const outputPath = `${urlPath}/index.html`;

            // Check if content file exists
            if (!fs.existsSync(contentFilePath)) {
                console.warn(`⚠️  Content file not found: ${contentFilePath} (skipping ${blog.title})`);
                return;
            }

            // Load blog content
            const content = fs.readFileSync(contentFilePath, 'utf8');

            // Calculate base path for this blog (usually ../../)
            const basePath = '../../';

            // Process featured image path
            const featuredImage = blog.featured_image.startsWith('images/')
                ? blog.featured_image
                : `images/${blog.featured_image}`;

            // Generate tags HTML
            const blogTags = generateBlogTags(blog.tags);

            // Get primary tag for related posts
            const primaryTag = Array.isArray(blog.tags) ? blog.tags[0] : blog.tags;

            // Generate related posts ID
            const relatedPostsId = `posts-${primaryTag.replace(/[^a-zA-Z0-9]/g, '')}`;

            // Build the blog page
            builder.buildPage({
                template: 'blog-post',
                outputPath: outputPath,
                pageTitle: blog.title,
                content: content,
                featuredImage: featuredImage,
                blogDate: formatBlogDate(blog.date),
                blogAuthor: blog.author,
                blogTags: blogTags,
                primaryTag: primaryTag,
                relatedPostsId: relatedPostsId,
                headerClass: 'defaultHeader'
            });

            console.log(`✅ Built blog: ${blog.title}`);
        });

        console.log(`\n🎉 Generated ${blogs.length} blog pages!`);
    } catch (error) {
        console.error(`Error building blog pages:`, error);
    }
}

// Build configuration for non-blog pages only
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
        outputPath: 'services/ai-consulting-transformation/index.html',
        pageTitle: 'AI Consulting & Transformation',
        headerClass: 'defaultHeader',
        content: processPageContent(loadPageContent('ai-consulting-transformation'), '../../')
    },

    {
        outputPath: 'services/llm-based-apps-and-gpt-integration/index.html',
        pageTitle: 'LLM Based Apps & GPT Integration',
        headerClass: 'defaultHeader',
        content: processPageContent(loadPageContent('llm-based-apps-and-gpt-integration'), '../../')
    },

    {
        outputPath: 'services/machine-learning-and-predictive-modeling/index.html',
        pageTitle: 'Machine Learning & Predictive Modeling',
        headerClass: 'defaultHeader',
        content: processPageContent(loadPageContent('machine-learning-and-predictive-modeling'), '../../')
    },

    {
        outputPath: 'services/nlp-computer-vision-and-generative-ai/index.html',
        pageTitle: 'NLP, Computer Vision & Generative AI',
        headerClass: 'defaultHeader',
        content: processPageContent(loadPageContent('nlp-computer-vision-and-generative-ai'), '../../')
    },

    {
        outputPath: 'services/custom-ai-solution-development/index.html',
        pageTitle: 'Custom AI Solution Development',
        headerClass: 'defaultHeader',
        content: processPageContent(loadPageContent('custom-ai-solution-development'), '../../')
    },

    {
        outputPath: 'services/mlops-and-continuous-training-pipelines/index.html',
        pageTitle: 'MLOps & Continuous Training Pipelines',
        headerClass: 'defaultHeader',
        content: processPageContent(loadPageContent('mlops-and-continuous-training-pipelines'), '../../')
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

// Build all pages
console.log('Building Aexyn website...');
console.log(`📄 Building ${pageConfigs.length} non-blog pages...`);

builder.buildPages(pageConfigs);

console.log(`📝 Building blog pages using template system...`);
buildBlogPages();

console.log('\n✅ Build complete!');
console.log('\nGenerated/Updated pages:');
pageConfigs.forEach(config => {
    console.log(`  - ${config.outputPath} (${config.pageTitle})`);
});

console.log('\n📁 Architecture:');
console.log('  - Blog pages: Generated from content files + template');
console.log('  - Other pages: Generated from source templates');
console.log('  - Components: Shared across all pages (header, footer, etc.)');

console.log('\n🚀 To serve locally, run: npm run serve');
console.log('📝 To rebuild, run: npm run build');