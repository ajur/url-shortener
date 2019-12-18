const promisify = require('util').promisify;
const generate = require('nanoid/generate');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const DEFAULT_KEY_LENGTH = 5;


const redisClient = require('redis').createClient(process.env.REDIS_URL);

redisClient.getAsync = promisify(redisClient.get);
redisClient.existsAsync = promisify(redisClient.exists);


async function generateId(len = DEFAULT_KEY_LENGTH) {
  const id = generate(ALPHABET, len);
  const exists = await redisClient.existsAsync(id);

  if (!exists){
    return id;
  } else {
    // duplication fallback
    console.warn(`[shortener] generateId hit duplicate on len=${len}`)
    return generateId(len + 1);
  }
}

async function shorten(url) {
  const shortId = await generateId();

  return shortId;
}

module.exports = {
  shorten
}
