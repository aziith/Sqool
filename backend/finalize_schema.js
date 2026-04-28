const fs = require('fs');
const { execSync } = require('child_process');

function finalize() {
    try {
        console.log("1. Restoring schema.prisma...");
        let content = fs.readFileSync('prisma/schema.prisma', 'utf8');
        
        // Restore env URL
        content = content.replace(/url\s+=\s+\".*\"/, '  url      = env("DATABASE_URL")');
        
        // Remove DEBUG_TEST
        content = content.split('\n').filter(l => !l.includes('DEBUG_TEST')).join('\n');
        
        fs.writeFileSync('prisma/schema.prisma', content, 'utf8');
        console.log("Schema restored.");

        console.log("2. Running prisma generate...");
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log("Prisma client generated.");

        console.log("3. Testing with debug script...");
        execSync('node debug_prisma.js', { stdio: 'inherit' });
        
    } catch (err) {
        console.error("Finalization failed:", err.message);
    }
}

finalize();
