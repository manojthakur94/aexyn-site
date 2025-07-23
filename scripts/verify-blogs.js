const path = require('path');
const fs = require('fs');

// Change to the parent directory (where the blog folders are)
process.chdir(path.join(__dirname, '..'));

const blogs = JSON.parse(fs.readFileSync('js/blogs.json', 'utf8'));

let missing = 0;
let hasContent = 0;

console.log('Checking all blogs from JSON file...\n');

blogs.forEach(blog => {
  const url = blog.url.replace(/^\//, '').replace(/\/$/, '');
  const contentFile = path.join(url, 'content.html');
  const indexFile = path.join(url, 'index.html');
  
  const hasContentFile = fs.existsSync(contentFile);
  const hasIndexFile = fs.existsSync(indexFile);
  
  if (!hasContentFile) {
    console.log('❌ Missing content.html:', url);
    missing++;
  } else if (!hasIndexFile) {
    console.log('❌ Missing index.html:', url);
    missing++;
  } else {
    // Check if content file has substantial content
    const contentStats = fs.statSync(contentFile);
    const indexStats = fs.statSync(indexFile);
    if (contentStats.size < 100) {
      console.log('⚠️  Very small content.html:', url, `(${contentStats.size} bytes)`);
    } else if (indexStats.size < 500) {
      console.log('⚠️  Very small index.html:', url, `(${indexStats.size} bytes)`);
    } else {
      hasContent++;
      console.log('✅', url);
    }
  }
});

console.log('\n📊 Summary:');
console.log(`Total blogs in JSON: ${blogs.length}`);
console.log(`Blogs with both files: ${hasContent}`);
console.log(`Missing/problematic files: ${missing}`);

if (missing === 0 && hasContent === blogs.length) {
  console.log('\n🎉 All blogs have complete content and generated files!');
} else {
  console.log('\n⚠️  Some blogs have issues.');
} 