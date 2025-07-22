const fs = require('fs');
const path = require('path');

class SiteBuilder {
    constructor() {
        this.components = {};
        this.templates = {};
        this.basePath = './';
        this.baseUrl = process.env.BASE_URL || '';
        this.nodeEnv = process.env.NODE_ENV || 'development';
    }

    // Load a component from the components directory
    loadComponent(name) {
        if (!this.components[name]) {
            const componentPath = path.join('components', `${name}.html`);
            if (fs.existsSync(componentPath)) {
                this.components[name] = fs.readFileSync(componentPath, 'utf8');
            } else {
                console.warn(`Component ${name} not found at ${componentPath}`);
                this.components[name] = '';
            }
        }
        return this.components[name];
    }

    // Load a template from the templates directory
    loadTemplate(name) {
        if (!this.templates[name]) {
            const templatePath = path.join('templates', `${name}.html`);
            if (fs.existsSync(templatePath)) {
                this.templates[name] = fs.readFileSync(templatePath, 'utf8');
            } else {
                console.warn(`Template ${name} not found at ${templatePath}`);
                this.templates[name] = '';
            }
        }
        return this.templates[name];
    }

    // Calculate the relative path to the root from a given file path
    calculateBasePath(filePath) {
        const depth = filePath.split('/').length - 1;
        return depth === 0 ? './' : '../'.repeat(depth);
    }

    // Replace placeholders in content with actual values
    replacePlaceholders(content, variables = {}) {
        let result = content;
        
        // Replace all {{variable}} placeholders
        Object.keys(variables).forEach(key => {
            const placeholder = `{{${key}}}`;
            const value = variables[key] || '';
            result = result.replace(new RegExp(placeholder, 'g'), value);
        });

        return result;
    }

    // Build a page using the specified template and content
    buildPage(config) {
        const {
            template = 'base',
            outputPath,
            pageTitle = 'Aexyn',
            headerClass = '',
            bodyClass = '',
            content = '',
            additionalHead = '',
            additionalScripts = ''
        } = config;

        // Calculate the base path for this page
        const basePath = this.calculateBasePath(outputPath);

        // Load components
        const head = this.loadComponent('head');
        const header = this.loadComponent('header');
        const footer = this.loadComponent('footer');
        const scripts = this.loadComponent('scripts');

        // Load template
        const templateContent = this.loadTemplate(template);

        // Prepare variables for replacement
        const variables = {
            basePath,
            baseUrl: this.baseUrl,
            nodeEnv: this.nodeEnv,
            pageTitle,
            headerClass,
            bodyClass,
            head: this.replacePlaceholders(head, { basePath, baseUrl: this.baseUrl, pageTitle, additionalHead }),
            header: this.replacePlaceholders(header, { basePath, baseUrl: this.baseUrl, headerClass }),
            footer: this.replacePlaceholders(footer, { basePath, baseUrl: this.baseUrl }),
            scripts: this.replacePlaceholders(scripts, { basePath, baseUrl: this.baseUrl, additionalScripts }),
            content,
            additionalHead,
            additionalScripts
        };

        // Replace placeholders in template
        const finalContent = this.replacePlaceholders(templateContent, variables);

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write the final file
        fs.writeFileSync(outputPath, finalContent, 'utf8');
        console.log(`Built: ${outputPath}`);
    }

    // Build multiple pages from a configuration array
    buildPages(pageConfigs) {
        pageConfigs.forEach(config => {
            this.buildPage(config);
        });
    }
}

module.exports = SiteBuilder;

// If running directly, build some example pages
if (require.main === module) {
    const builder = new SiteBuilder();
    
    // Example usage - you can customize this
    const homeContent = `
        <section class="banner full-banner home-banner" style="background-image:url(images/hero_1.jpeg)">
            <div class="container">
                <div class="bannerContent">
                    <div class="content-holder">
                        <h1 style="font-weight: normal;">Your Trusted <strong class="highlighted">AI Development Partner</strong> for Scalable, Intelligent Digital Transformation</h1>
                        <p>From intelligent platforms to predictive insights, Aexyn empowers businesses to thrive in the AI era. We build tailor-made AI solutions, LLM integrations, and scalable platforms that deliver measurable outcomes.</p>
                    </div>
                    <div class="btn-grid">
                        <div class="btn-item">
                            <a href="/contact-us" class="cm-btn">
                                <span class="btn-text">Talk to an AI Expert</span>
                                <span class="btn-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                                        <path style="fill:currentColor;" d="m17.5 5.999-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.499l-6.5-6.5z" data-name="Right"/>
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Add more content sections here -->
    `;

    const pages = [
        {
            outputPath: 'index.html',
            pageTitle: 'Home',
            content: homeContent
        },
        {
            outputPath: 'blog/index.html',
            pageTitle: 'Blogs',
            headerClass: 'defaultHeader',
            content: `
                <section class="accentColor2 text-center simple_banner">
                    <div class="container">
                        <div class="small_container">
                            <span class="badge">Blogs</span>
                            <h1><span class="highlighted">Aexyn</span> Blogs</h1>
                            <h5>Explore our expert insights, thought leadership, and industry trends.</h5>
                        </div>
                    </div>
                </section>
            `
        }
    ];

    builder.buildPages(pages);
    console.log('Build complete!');
} 