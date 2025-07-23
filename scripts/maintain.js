#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Change to the project root directory
process.chdir(path.join(__dirname, '..'));

console.log('🧹 Aexyn Site Maintenance Tool\n');

// Command line argument parsing
const command = process.argv[2];

if (!command) {
    showHelp();
    process.exit(0);
}

function loadBlogs() {
    try {
        const blogsContent = fs.readFileSync('js/blogs.json', 'utf8');
        return JSON.parse(blogsContent);
    } catch (error) {
        console.error('❌ Error loading blogs.json:', error.message);
        return [];
    }
}

function showHelp() {
    console.log('Available commands:');
    console.log('  clean-generated    Remove all generated HTML files (keep source files)');
    console.log('  list-source        List all source content files');
    console.log('  list-generated     List all generated files');
    console.log('  verify-structure   Verify the source/generated file structure');
    console.log('  help               Show this help message');
}

function cleanGenerated() {
    console.log('🗑️  Removing generated files...\n');
    
    const blogs = loadBlogs();
    let removedCount = 0;
    
    // Remove generated blog pages
    blogs.forEach(blog => {
        const urlPath = blog.url.replace(/^\//, '').replace(/\/$/, '');
        const generatedFile = path.join(urlPath, 'index.html');
        
        if (fs.existsSync(generatedFile)) {
            fs.unlinkSync(generatedFile);
            console.log(`  ✅ Removed: ${generatedFile}`);
            removedCount++;
        }
    });
    
    // Remove other generated files
    const otherGenerated = [
        'index.html',
        'blog/index.html',
        'services/index.html',
        'services/digital-product-development/index.html',
        'services/mobile-development/index.html',
        'services/web-development/index.html',
        'services/IoT-Development/index.html',
        'services/wap/index.html',
        'Industries/index.html'
    ];
    
    otherGenerated.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`  ✅ Removed: ${file}`);
            removedCount++;
        }
    });
    
    console.log(`\n🎉 Cleanup complete! Removed ${removedCount} generated files.`);
    console.log('💡 Run "npm run build" to regenerate all files.');
}

function listSource() {
    console.log('📂 Source files:\n');
    
    // Blog content files
    const contentFiles = [];
    const blogs = loadBlogs();
    blogs.forEach(blog => {
        const urlPath = blog.url.replace(/^\//, '').replace(/\/$/, '');
        const contentFile = path.join(urlPath, 'content.html');
        if (fs.existsSync(contentFile)) {
            contentFiles.push(contentFile);
        }
    });
    
    console.log(`📝 Blog content files (${contentFiles.length}):`);
    contentFiles.forEach(file => console.log(`  - ${file}`));
    
    // Page files
    const pageFiles = fs.readdirSync('pages').filter(f => f.endsWith('.html'));
    console.log(`\n📄 Page files (${pageFiles.length}):`);
    pageFiles.forEach(file => console.log(`  - pages/${file}`));
    
    // Template files
    const templateFiles = fs.readdirSync('templates').filter(f => f.endsWith('.html'));
    console.log(`\n🎨 Template files (${templateFiles.length}):`);
    templateFiles.forEach(file => console.log(`  - templates/${file}`));
    
    // Component files
    const componentFiles = fs.readdirSync('components').filter(f => f.endsWith('.html'));
    console.log(`\n🧩 Component files (${componentFiles.length}):`);
    componentFiles.forEach(file => console.log(`  - components/${file}`));
}

function listGenerated() {
    console.log('🏗️  Generated files:\n');
    
    const blogs = loadBlogs();
    const generatedFiles = [];
    
    // Check blog pages
    blogs.forEach(blog => {
        const urlPath = blog.url.replace(/^\//, '').replace(/\/$/, '');
        const generatedFile = path.join(urlPath, 'index.html');
        if (fs.existsSync(generatedFile)) {
            generatedFiles.push(generatedFile);
        }
    });
    
    // Check other pages
    const otherGenerated = [
        'index.html',
        'blog/index.html',
        'services/index.html',
        'services/digital-product-development/index.html',
        'services/mobile-development/index.html',
        'services/web-development/index.html',
        'services/IoT-Development/index.html',
        'services/wap/index.html',
        'Industries/index.html'
    ];
    
    otherGenerated.forEach(file => {
        if (fs.existsSync(file)) {
            generatedFiles.push(file);
        }
    });
    
    console.log(`📦 Generated HTML files (${generatedFiles.length}):`);
    generatedFiles.forEach(file => {
        const stats = fs.statSync(file);
        const size = (stats.size / 1024).toFixed(1);
        console.log(`  - ${file} (${size} KB)`);
    });
}

function verifyStructure() {
    console.log('🔍 Verifying site structure...\n');
    
    const blogs = loadBlogs();
    let issues = 0;
    let success = 0;
    
    console.log('📝 Checking blog files:');
    blogs.forEach(blog => {
        const urlPath = blog.url.replace(/^\//, '').replace(/\/$/, '');
        const contentFile = path.join(urlPath, 'content.html');
        const generatedFile = path.join(urlPath, 'index.html');
        
        const hasContent = fs.existsSync(contentFile);
        const hasGenerated = fs.existsSync(generatedFile);
        
        if (!hasContent) {
            console.log(`  ❌ Missing source: ${contentFile}`);
            issues++;
        } else if (!hasGenerated) {
            console.log(`  ⚠️  Missing generated: ${generatedFile} (run build)`);
            issues++;
        } else {
            console.log(`  ✅ ${blog.title}`);
            success++;
        }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Working blogs: ${success}`);
    console.log(`  ⚠️  Issues found: ${issues}`);
    
    if (issues === 0) {
        console.log('\n🎉 All good! Your site structure is clean.');
    } else {
        console.log('\n💡 Run "npm run build" to fix missing generated files.');
    }
}

// Execute command
switch (command) {
    case 'clean-generated':
        cleanGenerated();
        break;
    case 'list-source':
        listSource();
        break;
    case 'list-generated':
        listGenerated();
        break;
    case 'verify-structure':
        verifyStructure();
        break;
    case 'help':
        showHelp();
        break;
    default:
        console.log(`❌ Unknown command: ${command}`);
        console.log('');
        showHelp();
        process.exit(1);
} 