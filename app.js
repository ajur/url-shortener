const express = require('express');
const path = require('path');
const morgan = require('morgan');

const port = process.env.PORT || 3000;
const staticsPath = path.join(__dirname, 'public');

const logger = morgan

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(staticsPath));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.post('/', (req, res) => {
  console.log('shortcut entry point');
});

app.get('/:id(\\w+)', (req, res) => {
  res.status(404).sendFile('404.html', {root: staticsPath});
});

app.use((req, res, next) => {
  res.status(404).sendFile('404.html', {root: staticsPath});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
