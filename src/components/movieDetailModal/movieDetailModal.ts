import './style.css';
import { DETAIL_MODAL_TEMPLATE } from '../../constants/templates';
import { MovieDetailType } from '../../types/movie';
import httpRequest from '../../api/httpRequest';
import filterMovieDetail from '../../domain/filterMovieDetail';
import HTTPError from '../../api/HttpError';
import errorMessage from '../../error/errorMessage';
import { STAR_EMPTY, STAR_FILLED } from '../../images';
import { RATING_MESSAGE } from '../../constants/rating';
import rating from '../../domain/rating';

const movieDetailModal = {
  createModal() {
    return document.createElement('dialog');
  },

  insertTemplate(movie: MovieDetailType | null) {
    const dialog = document.querySelector('dialog');
    if (!movie || !dialog) return;

    const ratingValue = this.getLocalRatingValue(movie.id);
    dialog.innerHTML = DETAIL_MODAL_TEMPLATE(movie, ratingValue);
    this.setModalCloseEvent();
    this.handleRating(movie.id);
  },

  handleDetailModal(ul: HTMLElement) {
    const dialog = document.querySelector('dialog');

    if (dialog && ul) {
      ul.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLDivElement;
        if (target && target.className === 'item-list') return;

        const movieId = Number(target?.closest('a')?.getAttribute('data-id')) ?? 0;
        this.getMovieDetail(movieId).then((movie: MovieDetailType | null) => {
          if (movie !== null) movieDetailModal.insertTemplate(movie);
        });
        dialog.showModal();
      });
    }
  },

  async getMovieDetail(movieId: number): Promise<MovieDetailType | null> {
    try {
      const movieDetail = await httpRequest.fetchMovieDetail(movieId);
      const filteredMovieDetail = filterMovieDetail(movieDetail);
      return filteredMovieDetail;
    } catch (error) {
      const customError = error as HTTPError;
      errorMessage.apiError(customError.statusCode, customError.message ?? '');
      return null;
    }
  },

  setModalCloseEvent() {
    const closeButton = document.querySelector('#detail-modal--close-btn');
    const dialog = document.querySelector('dialog');
    if (closeButton && dialog) {
      closeButton.addEventListener('click', () => dialog.close());
    }
  },

  handleRating(movieId: number) {
    const ratingHtml = document.querySelector('#detail-modal--rating');
    if (!ratingHtml || !(ratingHtml instanceof HTMLElement)) return;

    ratingHtml.addEventListener('click', (event: Event) => {
      const clickedRatingValue = this.findClickedIndex(event, movieId);
      this.fillStars(ratingHtml, clickedRatingValue);
      this.updateRatingValue(ratingHtml, clickedRatingValue);
      this.updateRatingLabel(ratingHtml, clickedRatingValue);
    });
  },

  findClickedIndex(event: Event, movieId: number): number {
    const target = event.target as HTMLElement;
    if (!target || target.className !== 'rating-star') return 0;

    const idAttribute = target.getAttribute('data-id');
    if (!idAttribute) return 0;
    const ratingValue = Number(idAttribute);
    this.updateLocalRatingValue(movieId, ratingValue);
    return ratingValue;
  },

  fillStars(ratingHtml: HTMLElement, clickedRatingValue: number) {
    const ratingStarList = ratingHtml.querySelectorAll('.rating-star');
    ratingStarList.forEach((star, index) => {
      star.setAttribute('src', index * 2 < clickedRatingValue ? STAR_FILLED : STAR_EMPTY);
    });
  },

  updateRatingValue(ratingHtml: HTMLElement, clickedRatingValue: number) {
    const ratingValueHtml = ratingHtml.querySelector('#detail-modal--rating-value');
    if (!ratingValueHtml) return;
    ratingValueHtml.innerHTML = String(clickedRatingValue);
  },

  updateRatingLabel(ratingHtml: HTMLElement, clickedRatingValue: number) {
    const ratingLabelHtml = ratingHtml.querySelector('#detail-modal--rating-label');
    if (!ratingLabelHtml) return;
    ratingLabelHtml.innerHTML = RATING_MESSAGE[clickedRatingValue];
  },

  getLocalRatingValue(id: number): number {
    return rating.getLocalDataItem(id).ratingValue;
  },

  updateLocalRatingValue(id: number, ratingValue: number) {
    rating.updateLocalData(id, ratingValue);
  },
};

export default movieDetailModal;
