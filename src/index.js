import './css/main.css';
import ApiService from './js/api-service';
import picturesTpl from './templates/pictures.hbs';
import LoadMoreBtn from './js/load-moreBtn';
import { alert, defaults } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

defaults.delay = '2000';

const refs = {
    searchForm: document.querySelector('.js-search-form'),
    galleryContainer: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

const apiService = new ApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchPictures);

function onSearch(e) {
    e.preventDefault();

    apiService.query = e.currentTarget.elements.query.value;

    if (apiService.query === '') {
        return alert('Enter you request');
    }

    loadMoreBtn.show();
    apiService.resetPage();
    clearPicturesContainer();
    fetchPictures();
}

function fetchPictures() {
    loadMoreBtn.disable();

    apiService.fetchPictures().then(hits => {
        if (hits.length === 0) {
            loadMoreBtn.hide();
            return alert('Sorry, no matches found... Try another worlds!');
        }
        appendPicturesMarkup(hits);
        loadMoreBtn.enable();
    });
}

function appendPicturesMarkup(hits) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', picturesTpl(hits));
    autoScroll();
}

function clearPicturesContainer() {
    refs.galleryContainer.innerHTML = '';
}

function autoScroll() {
    loadMoreBtn.refs.button.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
    });
}
