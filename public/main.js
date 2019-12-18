
const formElement = document.getElementById('shorten-form');
const urlInput = document.getElementById('url');
const errors = document.getElementById('errors');

formElement.addEventListener('submit', function (evt) {
  evt.preventDefault();

  const formData = new FormData(evt.target);
  const url = formData.get('url');

  Array.from(errors.children).forEach(child => errors.removeChild(child));

  const reqSpec = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({url})
  };

  fetch('/', reqSpec)
    .then(response => response.json())
    .then(data => {
      console.log('got response', data);
      if (data.error) {
        throw data.error;
      }
      urlInput.value = data.short;
    })
    .catch(err => {
      console.log('got error', err)
      errors.innerHTML = `<li>${err.toString()}</li>`;
    });

});
