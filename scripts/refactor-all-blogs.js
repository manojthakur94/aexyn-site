const fs = require('fs');
const path = require('path');

const blogsFilePath = path.join(__dirname, '..', 'js', 'blogs.json');
const blogs = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'));

const extractContent = (html) => {
    const sectionRegex = /<section[^>]*>[\s\S]*?<\/section>/g;
    const sections = html.match(sectionRegex);

    if (sections) {
        return sections.join('\n\n');
    }

    return '';
};

blogs.forEach(blog => {
  const blogUrl = blog.url.replace(/^\//, '').replace(/\/$/, '');
  const blogIndexPath = path.join(__dirname, '..', blogUrl, 'index.html');
  const blogContentPath = path.join(__dirname, '..', blogUrl, 'content.html');

  if (fs.existsSync(blogIndexPath)) {
    const html = fs.readFileSync(blogIndexPath, 'utf-8');
    const pureContent = extractContent(html);

    // Save the pure content to content.html
    fs.writeFileSync(blogContentPath, pureContent, 'utf-8');
    console.log(`Extracted content for ${blog.title}`);
  } else {
    console.warn(`Could not find file for ${blog.title}`);
  }
});

console.log('\n✅ Content extraction complete!');
console.log('📝 Pure content saved to content.html files');
console.log('🔄 The build script will now read from content.html instead of index.html'); 