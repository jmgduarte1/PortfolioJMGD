'use strict';

const express = require('express');
const { existsSync } = require('node:fs');
const { join } = require('node:path');

const app = express();
const port = process.env.PORT || 3000;
const bundledServerPath = existsSync(join(__dirname, 'server', 'server.mjs'))
  ? './server/server.mjs'
  : './dist/portfolio-jmgd/server/server.mjs';
let angularHandlerPromise;

function getAngularHandler() {
  angularHandlerPromise ??= import(bundledServerPath)
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
