'use strict';

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
let angularHandlerPromise;

function getAngularHandler() {
  angularHandlerPromise ??= import('./dist/portfolio-jmgd/server/server.mjs')
    .then(({ reqHandler }) => reqHandler)
    .catch((error) => {
      angularHandlerPromise = undefined;
      throw error;
    });

  return angularHandlerPromise;
}

app.use((req, res, next) => {
  getAngularHandler()
    .then((angularHandler) => angularHandler(req, res, next))
    .catch(next);
});

app.listen(port, '0.0.0.0', (error) => {
  if (error) {
    throw error;
  }

  console.log(`Node Express server listening on port ${port}`);
});
