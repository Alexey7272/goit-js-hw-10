import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix, { Notify } from 'notiflix';
import { fetchCountries } from './country';

const DEBOUNCE_DELAY = 300;

const refs = {
   input: document.querySelector('#search-box'),
   list: document.querySelector('.country-list'),
   info: document.querySelector('.country-info')
};

refs.input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry() {
    const name = refs.input.value.trim()

    if (name === '') {
      return (refs.list.innerHTML = ''), (refs.info.innerHTML = '')
    }

    fetchCountries(name) 
    .then(countries => {
        refs.list.innerHTML = ''
        refs.info.innerHTML = ''

        if (countries.length === 1) {
          refs.list.insertAdjacentHTML('beforeend', renderList(countries))
          refs.info.insertAdjacentHTML('beforeend', renderInfo(countries))
        } else if (countries.length >= 10) {
            alertNoSpecific()
        } else {
          refs.list.insertAdjacentHTML('beforeend', renderList(countries))
        }
    })
    .catch(alertNoCountry)
};

function renderList(countries) {
   const markup = countries.map(({ name, flags }) => {
    return `
    <li class="country-list__item">
        <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
        <h2 class="country-list__name">${name.official}</h2>
    </li>
    `
   })
   .join('')
  return markup
};

function renderInfo(countries) {
    const markup = countries.map(({ capital, population, languages}) => {
        return `
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
        </ul>
        `
    })
    .join('')
   return markup
};


function alertNoSpecific () {
    Notify.info('Too many matches found. Please enter a more specific name.')
};

function alertNoCountry () {
    Notify.failure('Oops, there is no country with that name.')
};