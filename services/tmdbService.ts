const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY") || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export class TMDBService {
  static async searchMovies(searchQuery: string) {
    try {
        const searchResponse = await fetch(
            `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(searchQuery)}&language=de-DE`,
            {
              headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${TMDB_API_KEY}`
              }
            }
          )
      
      if (!searchResponse.ok) {
        throw new Error("Failed to fetch from TMDB");
      }

      const data = await searchResponse.json();
      return data.results;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`TMDB API Error: ${message}`);
    }
  }

  static async getPopularMovies() {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?language=de-DE`,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${TMDB_API_KEY}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch from TMDB");
      }

      const data = await response.json();
      return data.results;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`TMDB API Error: ${message}`);
    }
  }
} 