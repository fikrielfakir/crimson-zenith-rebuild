import { spawn } from 'child_process';

const server = spawn('node', ['node_modules/tsx/dist/cli.mjs', 'server.ts'], {
  stdio: 'inherit',
});

const vite = spawn('node', ['node_modules/vite/bin/vite.js'], {
  stdio: 'inherit',
});

const laravel = spawn('php', ['artisan', 'config:clear', '--quiet'], {
  cwd: './laravel-api',
  stdio: 'inherit',
});

laravel.on('exit', () => {
  const laravelServe = spawn(
    'php',
    ['artisan', 'serve', '--host=0.0.0.0', '--port=8000'],
    { cwd: './laravel-api', stdio: 'inherit' }
  );
  laravelServe.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`Laravel API exited with code ${code}`);
    }
  });
});

const cleanup = () => {
  server.kill();
  vite.kill();
  laravel.kill();
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
