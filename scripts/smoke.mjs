import { spawn } from 'node:child_process';
import http from 'node:http';

const PORT = process.env.PORT || '4010';

function get(path) {
  return new Promise((resolve) => {
    const req = http.get({ hostname: '127.0.0.1', port: PORT, path, timeout: 5000 }, (res) => {
      // drain
      res.resume();
      resolve({ status: res.statusCode || 0, path });
    });
    req.on('error', () => resolve({ status: 0, path }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, path });
    });
  });
}

async function main() {
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', PORT], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT },
  });

  let started = false;
  server.stdout.on('data', (d) => {
    const s = String(d);
    if (!started && /Ready in|started server/i.test(s)) started = true;
    process.stdout.write(s);
  });
  server.stderr.on('data', (d) => process.stderr.write(String(d)));

  const start = Date.now();
  while (!started && Date.now() - start < 10000) {
    await new Promise((r) => setTimeout(r, 200));
  }

  if (!started) {
    server.kill();
    console.error('Server failed to start in time');
    process.exit(1);
  }

  const checks = ['/', '/contact', '/api/health'];
  const results = await Promise.all(checks.map((p) => get(p)));
  let ok = true;
  for (const r of results) {
    const good = r.status >= 200 && r.status < 400;
    ok = ok && good;
    console.log(`[SMOKE] ${r.path} -> ${r.status}`);
  }

  server.kill();
  if (!ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

