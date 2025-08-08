// ecosystem.config.js
module.exports = {
      apps: [
        {
          name: 'CDS',
          script: 'src/index.ts',
          interpreter: 'ts-node',
          watch: true,
        },
      ],
    };
    