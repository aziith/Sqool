const { spawn } = require('child_process');

const migrate = spawn('npx.cmd', ['prisma', 'migrate', 'dev', '--name', 'add_exams_module_v3'], {
  cwd: process.cwd(),
  stdio: ['pipe', 'inherit', 'inherit']
});

migrate.stdin.write('y\n');
migrate.stdin.end();

migrate.on('close', (code) => {
  process.exit(code);
});
