const fs = require('fs');
const path = require('path');

// Define files and directories to clean
const itemsToClean = [
    'index.html',
    'blog',
    'services',
    'Industries'
];

function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
}

function deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${filePath}`);
    }
}

console.log('🧹 Cleaning built files...');

itemsToClean.forEach(item => {
    const itemPath = path.resolve(item);
    if (fs.existsSync(itemPath)) {
        const stats = fs.lstatSync(itemPath);
        if (stats.isDirectory()) {
            deleteFolderRecursive(itemPath);
            console.log(`Deleted directory: ${item}`);
        } else {
            deleteFile(itemPath);
        }
    }
});

console.log('✅ Clean complete!');
console.log('💡 Run "npm run build" to rebuild the site.'); 