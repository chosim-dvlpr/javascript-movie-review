import createMovieContents from '../MovieContents/MovieContents';
import './style.css';

interface Props {
  imageSource: string;
}

// eslint-disable-next-line max-lines-per-function
const createHeader = ({ imageSource }: Props) => {
  const header = document.createElement('header');
  const templates =
    /* html */
    `
      <h1><img src=${imageSource} alt="MovieList 로고" /></h1>
      <form class="search-box">
        <input type="text" name="search" placeholder="검색" />
        <button type="submit" class="search-button">검색</button>
      </form>
    `;
  header.innerHTML = templates;

  header.querySelector('.search-box')?.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const input = (form.elements.namedItem('search') as HTMLInputElement).value;
    const movieContents = await createMovieContents.execute('search', input);

    document.querySelector('main')?.remove();
    document.querySelector('#app')?.appendChild(movieContents);
  });
  return header;
};

export default createHeader;
