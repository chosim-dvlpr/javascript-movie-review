import { MovieListType } from '../types/movie';
import HTTPError from './HttpError';

/**
 * 오프라인에 대응하는 에러 메세지 출력하는 함수
 */
async function tryCatchApi(link: string) {
  try {
    const response = await fetch(link);
    return response;
  } catch (error) {
    throw new HTTPError(0, '다시 시도해 주세요.');
  }
}

const httpRequest = {
  async fetchPopularMovies(
    page: number,
  ): Promise<{ movieList: MovieListType; isLastPage: boolean }> {
    const response = await tryCatchApi(
      `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}&api_key=${process.env.API_KEY}`,
    );

    if (response.status !== 200) throw new HTTPError(response.status, '다시 시도해 주세요.');

    const responseData = await response.json();
    const movieList = responseData.results;

    const { total_pages: totalPages, page: currentPages } = responseData;
    const isLastPage = totalPages === currentPages;
    return { movieList, isLastPage };
  },

  async fetchSearchedMovies(
    page: number,
    input: string,
  ): Promise<{ movieList: MovieListType; isLastPage: boolean }> {

    const responseData = await response.json();
    const movieList = responseData.results;
    if (movieList.length === 0) {
      throw new HTTPError(response.status, '검색된 영화가 없습니다.');
    }

    const { total_pages: totalPages, page: currentPages } = responseData;
    const isLastPage = totalPages === currentPages;
    return { movieList, isLastPage };
  },

  async fetchMovieDetail(movieId: number) {
    const response = await tryCatchApi(
      `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR&api_key=${process.env.API_KEY}`,
    );

    if (response.status !== 200) throw new HTTPError(response.status, '다시 시도해 주세요.');

    const movieDetail = await response.json();
    return movieDetail;
  },
};

export default httpRequest;
