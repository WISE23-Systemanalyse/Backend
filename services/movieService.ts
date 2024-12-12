import {findMovieById} from "../db/db.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";


// get Movie by ID or by name
const movieService = {
  getMovie: async (id: number) => {
    return (await findMovieById(id))[0];
  },
};

export { movieService };
