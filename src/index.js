const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://api.escuelajs.co/api/v1/products';
const HASTA = 10;
let INICIAEN = 5;
localStorage.setItem('pagination', INICIAEN);
const getData = async api => {
  console.log(api.products);
  try {
    const response = await fetch(
      `${api}?offset=${INICIAEN}&limit=${HASTA}`
    );
    const products = await response.json();
    let output = products.map(
      product => `
          <article class="Card">
            <img src="${product.images[0]}" alt="${product.title}"/>
            <h2>
              ${product.title}
              <small>$ ${product.price} </small>
            </h2>
          </article>
          `
    );
    INICIAEN += HASTA;
    let newItem = document.createElement('section');
    newItem.classList.add('Items');
    newItem.innerHTML = output.join('');
    $app.appendChild(newItem);
  } catch (error) {
    throw new Error('[getData] - No se pudieron cargar los datos');
  }
};

const loadData = async () => {
  try {
    await getData(API);
  } catch (error) {
    let newItem = document.createElement('div');
    newItem.classList.add('error-msg');
    newItem.innerHTML = 'Ups! Intentalo de nuevo';
    $app.appendChild(newItem);
  }
  if (INICIAEN >= 200) {
    $observe.remove();
    let newItem = document.createElement('div');
    newItem.classList.add('msg');
    newItem.style.textAlign = 'center';
    newItem.style.padding = '2rem';
    newItem.style.fontSize = '17px';
    newItem.style.color = '#adadad';
    newItem.innerHTML = 'Todos los productos Obtenidos';
    $app.appendChild(newItem);
  }
};

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },{
    rootMargin: '0px 0px 100% 0px',
  }
);

intersectionObserver.observe($observe);
