import { performPackageSecurityScan } from './packages/Nalth/src/node/cli/install-command.js';

// Test with various package names
const testPackages = [
  'react',
  'react-dom',
  'e',
  'express',
  'lodash',
  'crypto-miner',
  'keylogger'
];

console.log('Testing package security scan...\n');

// Run the security scan
await performPackageSecurityScan(testPackages);

console.log('\n✅ Security scan completed successfully!');
