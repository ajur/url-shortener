
const formElement = document.getElementById('shorten-form');
const urlInput = document.getElementById('url');
const submitButton = document.getElementById('submit-button');
const copyButton = document.getElementById('copy-button');
const infoElement = document.getElementById('info');

formElement.addEventListener('submit', handleSubmit);
urlInput.addEventListener('input', handleInputChange);
copyButton.addEventListener('click', handleCopy);


async function shortenUrl(url) {
  const data = await fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({url})
  }).then(resp => resp.json());

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

async function handleSubmit (evt) {
  console.log('handle submit');
  evt.preventDefault();
  setWaitingState();
  clearInfo();

  const url = urlInput.value;

  try {
    const response = await shortenUrl(url);
    console.log('got short', response);

    urlInput.value = response.short;
    urlInput.select();
    addInfo("Target URL: " + response.url);
    setCopyState();
  } catch(err) {
    console.log('got error from server', err)
    addInfo(err.message || msg, {isError: true});
    setNormalState();
  }
}

function handleInputChange (evt) {
  clearInfo();
  setNormalState();
}

function handleCopy (evt) {
  addInfo("Short URL copied to clipboard");
  urlInput.select();
  document.execCommand('copy', true);
}

function setWaitingState() {
  submitButton.disabled = true;
  submitButton.value = "Shortening...";
}

function setNormalState() {
  submitButton.disabled = false;
  submitButton.value = "Shorten";
  submitButton.classList.remove('hidden');
  copyButton.classList.add('hidden');
}

function setCopyState() {
  submitButton.classList.add('hidden');
  copyButton.classList.remove('hidden');
}

function addInfo(text, {isError = false} = {}) {
  infoElement.innerHTML = infoElement.innerHTML + `<div ${isError ? 'class="error"' : ''}>${text}</div>`;
}

function clearInfo() {
  Array.from(infoElement.children).forEach(child => infoElement.removeChild(child));
}

