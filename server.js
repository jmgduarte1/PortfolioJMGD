'use strict';

import('./dist/portfolio-jmgd/server/server.mjs')
  .then(({ startServer }) => startServer())
  .catch((error) => {
    console.error('Unable to start the Angular SSR server.', error);
    process.exitCode = 1;
  });
