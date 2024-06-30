import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function onSuccess({ position, delay }) {
  iziToast.success({
    title: 'Success',
    message: `Fulfilled promise ${position + 1} in ${delay}ms`,
    position: 'topCenter',
  });
}

function onError({ position, delay }) {
  iziToast.error({
    title: 'Error',
    message: `Rejected promise ${position + 1} in ${delay}ms`,
    position: 'topCenter',
  });
}

const refs = {
  form: document.querySelector('.form'),
  delay: document.querySelector('[name="delay"]'),
  step: document.querySelector('[name="step"]'),
  amount: document.querySelector('[name="amount"]'),
};

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  for (let i = 0; i < refs.form.elements.length; i += 1) {
    refs.form.elements[i].disabled = true;
  }

  let promises = [];

  for (let i = 0; i < refs.amount.value; i += 1) {
    promises[i] = createPromise(
      i,
      Number(refs.delay.value) + i * Number(refs.step.value)
    )
      .then(onSuccess)
      .catch(onError);
  }

  Promise.all(promises).finally(() => {
    for (let i = 0; i < refs.form.elements.length; i += 1) {
      refs.form.elements[i].disabled = false;
    }
  });

  refs.form.reset();
}
