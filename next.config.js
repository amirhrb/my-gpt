const withPWA = require('next-pwa')({
  dest: 'public',
  // register: true,
  // swSrc: 'service-worker.js',
});

module.exports = withPWA({
  // swcMinify: true,
  // next.js config
  output: 'standalone',
});
