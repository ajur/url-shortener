const generate = require('nanoid/generate');
const Redis = require("ioredis");


const redis = new Redis(process.env.REDIS_URL);


const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const DEFAULT_KEY_LENGTH = 5;
const EXPIRATION = 14 * 24 * 60 * 60;  // 14 days

const idToKey = (id) => 'short:' + id;
const urlToKey = (url) => 'url:' + url;


async function generateId(len = DEFAULT_KEY_LENGTH) {
  const id = generate(ALPHABET, len);
  const exists = await redis.exists(idToKey(id));

  if (!exists){
    return id;
  } else {
    // duplication fallback
    console.warn(`[shortener] generateId hit duplicate on len=${len}`)
    return generateId(len + 1);
  }
}


async function shorten(url) {
  let shortId = await redis.get(urlToKey(url));
  if (shortId) {
    console.debug(`[shortener] got same key ${shortId} for ${url}`);
    // update expiration times
    redis.multi()
      .expire(idToKey(shortId), EXPIRATION)
      .expire(urlToKey(url), EXPIRATION)
      .exec();
  } else {
    shortId = await generateId();
    console.debug(`[shortener] generated new key ${shortId} for ${url}`);
    // persist new entry
    redis.multi()
      .set(idToKey(shortId), url, 'EX', EXPIRATION)
      .set(urlToKey(url), shortId, 'EX', EXPIRATION)
      .exec();
  }
  return shortId;
}


async function getUrl(shortId) {
  const url = await redis.get(idToKey(shortId));
  if (url) {
    console.debug(`[shortener] updating ttl of key ${shortId} for ${url}`);
    redis.multi()
      .expire(idToKey(shortId), EXPIRATION)
      .expire(urlToKey(url), EXPIRATION)
      .exec();
  }
  return url;
}


module.exports = {
  shorten,
  getUrl
}
