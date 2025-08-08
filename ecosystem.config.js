// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'CDS',
      script: 'dist/index.js',
      interpreter: 'ts-node',
      watch: true,
    },
  ],
};
