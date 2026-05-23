#!/usr/bin/env node

/**
 * Hostinger Next.js Server Starter
 * This script starts the Next.js application on Hostinger
 */

const { spawn } = require('child_process');
const path = require('path');

// Load environment variables from a .env file if present in common locations.
// This allows the app to pick up .env placed outside public_html (for security).
try {
  const dotenv = require('dotenv')
  const tryPaths = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '.env.local'),
    path.join(__dirname, '.env.production'),
    path.join(__dirname, '.env.production.local'),
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '.env.local'),
    path.join(__dirname, '..', '.env.production'),
    path.join(__dirname, '..', '.env.production.local'),
    path.join(__dirname, '..', '..', '.env'),
    path.join(__dirname, '..', '..', '.env.local'),
    path.join(__dirname, '..', '..', '.env.production'),
    path.join(__dirname, '..', '..', '.env.production.local'),
  ]

  let loaded = false
  for (const p of tryPaths) {
    try {
      const res = dotenv.config({ path: p })
      if (res.parsed) {
        console.log(`Loaded .env from ${p}`)
        loaded = true
        break
      }
    } catch (e) {
      // ignore and try next
    }
  }
  if (!loaded) {
    if (process.env.NODE_ENV !== 'production') console.log('No .env file loaded from common locations')
  }
} catch (e) {
  // dotenv not available — environment variables must be provided by the host
  if (process.env.NODE_ENV !== 'production') console.warn('dotenv not installed; skipping .env load')
}

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

console.log(`\n${'='.repeat(60)}`);
console.log(`Starting CarDefiner Next.js Server`);
console.log(`${'='.repeat(60)}`);
console.log(`Environment: ${NODE_ENV}`);
console.log(`Port: ${PORT}`);
console.log(`Node Version: ${process.version}`);
console.log(`Working Directory: ${process.cwd()}`);
console.log(`${'='.repeat(60)}\n`);

const fs = require('fs');

// Start Next.js server
const nextBinCandidates = [
  path.join(__dirname, 'node_modules', '.bin', 'next'),
  path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next')
];

let nextBin = nextBinCandidates.find((candidate) => fs.existsSync(candidate));

if (!nextBin) {
  try {
    nextBin = require.resolve('next/dist/bin/next');
  } catch (err) {
    // ignore resolution error
  }
}

if (!nextBin) {
  console.error('Cannot find the Next.js binary. Make sure dependencies are installed and the app is running from the app root.');
  console.error('Checked paths:');
  nextBinCandidates.forEach((candidate) => console.error(`  - ${candidate}`));
  process.exit(1);
}

const server = spawn(process.execPath, [
  nextBin,
  'start',
  '-p',
  PORT
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV,
    PORT
  },
  cwd: __dirname
});

server.on('error', (err) => {
  console.error('\n❌ Failed to start server:', err.message);
  console.error('Error code:', err.code);
  if (err.code === 'ENOENT') {
    console.error('Next.js binary not found. Please ensure dependencies are installed.');
    console.error('Run: npm install');
  }
  process.exit(1);
});

server.on('exit', (code, signal) => {
  console.log(`\nℹ️  Server exited with code ${code}${signal ? ` (signal: ${signal})` : ''}`);
  process.exit(code || 0);
});

// Handle signals
process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});
