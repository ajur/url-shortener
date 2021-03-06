const path = require('path');

const express = require('express');
const morgan = require('morgan');
const normalizeUrl = require('normalize-url');

const shortener = require('./shortener');


const port = process.env.PORT || 3000;
const staticsPath = path.join(__dirname, 'public');


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(staticsPath));


app.get('/', (req, res) => {
  res.sendFile('index.html');
});


app.post('/', async (req, res) => {
  console.debug(`got post with url to shorten: "${req.body.url}"`);

  try {
    const url = new URL(normalizeUrl(req.body.url));
    if (url.host === req.get('host')) {
      throw Error("This URL is already shortened.");
    }

    const shortId = await shortener.shorten(url.href);

    res.send({
      url: url.href,
      short: normalizeUrl(req.get('host') + '/' + shortId),
      id: shortId
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
});


app.get('/:shortId(\\w+)', async (req, res) => {
  console.log('access shortened url with id ', req.params.shortId);
  const url = await shortener.getUrl(req.params.shortId);
  if (url) {
    console.info(`found ${req.params.shortId}, redirecting to ${url}`);
    res.redirect(301, url)
  } else {
    res.status(404).sendFile('404.html', { root: staticsPath });
  }
});


app.use((req, res, next) => {
  res.status(404).sendFile('404.html', { root: staticsPath });
});


app.listen(port, () => console.log(`Listening on port ${port}`));
