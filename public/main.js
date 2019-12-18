

function onSubmit(evt) {
  evt.preventDefault();

  const inputElement = evt.target.querySelector('#url');
  const urlToShorten = inputElement.value;

  console.log('form submitted:', urlToShorten);
}

const formElement = document.getElementById('url-input-form');
formElement.addEventListener('submit', onSubmit);
