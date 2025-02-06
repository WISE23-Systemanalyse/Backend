import { assertEquals, assertRejects } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { TMDBService } from "../../services/tmdbService.ts";

const mockMovieResponse = {
  results: [
    {
      id: 1,
      title: "Test Movie",
      overview: "Test Overview",
      release_date: "2024-01-01",
      poster_path: "/test.jpg"
    }
  ]
};

// Mock für fetch
const mockFetch = async (url: string, options: RequestInit) => {
  if (url.includes("/search/movie")) {
    return {
      ok: true,
      json: async () => mockMovieResponse
    };
  }
  
  if (url.includes("/movie/popular")) {
    return {
      ok: true,
      json: async () => mockMovieResponse
    };
  }

  throw new Error(`Unerwarteter URL-Aufruf: ${url}`);
};

Deno.test("TMDBService Tests", async (t) => {
  await t.step("setup", () => {
    // @ts-ignore - Mock fetch
    globalThis.fetch = mockFetch;
  });

  await t.step("sollte Filme suchen können", async () => {
    const results = await TMDBService.searchMovies("Test");
    assertEquals(results.length, 1);
    assertEquals(results[0].title, "Test Movie");
  });

  await t.step("sollte beliebte Filme abrufen können", async () => {
    const results = await TMDBService.getPopularMovies();
    assertEquals(results.length, 1);
    assertEquals(results[0].title, "Test Movie");
  });

  await t.step("sollte Fehler bei fehlgeschlagener API-Anfrage werfen", async () => {
    // @ts-ignore - Mock fetch für Fehlerfall
    globalThis.fetch = async () => ({
      ok: false,
      status: 404
    });

    await assertRejects(
      async () => {
        await TMDBService.searchMovies("Test");
      },
      Error,
      "TMDB API Error: Failed to fetch from TMDB"
    );
  });

  await t.step("sollte Netzwerkfehler abfangen", async () => {
    // @ts-ignore - Mock fetch für Netzwerkfehler
    globalThis.fetch = async () => {
      throw new Error("Network error");
    };

    await assertRejects(
      async () => {
        await TMDBService.searchMovies("Test");
      },
      Error,
      "TMDB API Error: Network error"
    );
  });
});
