import { spawn } from 'child_process';

const server = spawn('node', ['node_modules/tsx/dist/cli.mjs', 'server.ts'], {
  stdio: 'inherit',
});

const vite = spawn('node', ['node_modules/vite/bin/vite.js'], {
  stdio: 'inherit',
});

const cleanup = () => {
  server.kill();
  vite.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

server.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Server exited with code ${code}`);
    vite.kill();
    process.exit(code);
  }
});

vite.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Vite exited with code ${code}`);
    server.kill();
    process.exit(code);
  }
});
