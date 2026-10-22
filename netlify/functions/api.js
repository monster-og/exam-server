// Netlify Function entry point: wraps the Express app
const serverless = require('serverless-http');

// Persist data in Netlify Database instead of the temporary function filesystem
process.env.EXAM_STORAGE = 'netlify-db';
const app = require('../../server.js');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Requests rewritten from /api/* may arrive as /.netlify/functions/api/*; restore the /api prefix Express expects
  if (event.path && event.path.startsWith('/.netlify/functions/api')) {
    event.path = '/api' + event.path.slice('/.netlify/functions/api'.length);
  }
  return handler(event, context);
};
