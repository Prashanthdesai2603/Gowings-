const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let updated = 0;
walkDir('./src', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('http://localhost:5000')) {
            content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${process.env.NEXT_PUBLIC_API_URL}$1`');
            content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${process.env.NEXT_PUBLIC_API_URL}$1`');
            content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${process.env.NEXT_PUBLIC_API_URL}$1`');
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated', filePath);
            updated++;
        }
    }
});
console.log('Total files updated:', updated);
