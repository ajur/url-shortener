const generate = require('nanoid/generate');
const alphabet = 'abcdefghijklmnopqrstuvwxyz';

function generateId(url) {
  return generate(alphabet, 5);
}

module.exports = {
  generateId
}
