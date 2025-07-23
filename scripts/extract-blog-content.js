#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Change to the project root directory
process.chdir(path.join(__dirname, '..'));

console.log('🔄 Extracting blog content from existing HTML files...\n');

// Load blog data
function loadBlogs() {
    try {
        const blogsContent = fs.readFileSync('js/blogs.json', 'utf8');
        return JSON.parse(blogsContent);
    } catch (error) {
        console.error('❌ Error loading blogs.json:', error.message);
        return [];
    }
}

// Extract content from HTML file
function extractContentFromHTML(htmlContent) {
    try {
        // Find the start of article content
        const articleStartRegex = /<article class="post-content">/;
        const articleEndRegex = /<\/article>/;
        
        const startMatch = htmlContent.match(articleStartRegex);
        const endMatch = htmlContent.match(articleEndRegex);
        
        if (!startMatch || !endMatch) {
            console.error('Could not find article tags in HTML');
            return null;
        }
        
        const startIndex = startMatch.index + startMatch[0].length;
        const endIndex = endMatch.index;
        
        // Extract the content between article tags
        const content = htmlContent.substring(startIndex, endIndex).trim();
        
        return content;
    } catch (error) {
        console.error('Error extracting content:', error.message);
        return null;
    }
}

// Main extraction function
function extractAllBlogContent() {
    const blogs = loadBlogs();
    let successCount = 0;
    let errorCount = 0;
    
    blogs.forEach(blog => {
        try {
            const urlPath = blog.url.replace(/^\//, '').replace(/\/$/, '');
            const htmlFilePath = path.join(urlPath, 'index.html');
            const contentFilePath = path.join(urlPath, 'content.html');
            
            // Check if HTML file exists
            if (!fs.existsSync(htmlFilePath)) {
                console.log(`⚠️  HTML file not found: ${htmlFilePath}`);
                errorCount++;
                return;
            }
            
            // Check if content file already exists
            if (fs.existsSync(contentFilePath)) {
                console.log(`⏭️  Content already exists: ${contentFilePath}`);
                return;
            }
            
            // Read HTML file
            const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
            
            // Extract content
            const extractedContent = extractContentFromHTML(htmlContent);
            
            if (!extractedContent) {
                console.log(`❌ Failed to extract content from: ${htmlFilePath}`);
                errorCount++;
                return;
            }
            
            // Write content file
            fs.writeFileSync(contentFilePath, extractedContent, 'utf8');
            console.log(`✅ Extracted: ${blog.title} -> ${contentFilePath}`);
            successCount++;
            
        } catch (error) {
            console.error(`❌ Error processing ${blog.title}:`, error.message);
            errorCount++;
        }
    });
    
    console.log(`\n📊 Extraction Summary:`);
    console.log(`  ✅ Successfully extracted: ${successCount} blogs`);
    console.log(`  ❌ Errors encountered: ${errorCount} blogs`);
    
    if (successCount > 0) {
        console.log(`\n🎉 Content extraction complete!`);
        console.log(`💡 Content files are now available in each blog directory.`);
        console.log(`📝 Run "npm run build" to regenerate all blog pages using the new template system.`);
    }
}

// Check if running directly
if (require.main === module) {
    extractAllBlogContent();
}

module.exports = { extractContentFromHTML, loadBlogs }; 