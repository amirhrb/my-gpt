const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // register: true,
  // swSrc: 'service-worker.js',
});

module.exports = withPWA({
  // swcMinify: true,
  // next.js config
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/chat',
        permanent: true,
      },
    ];
  },
});
