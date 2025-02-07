import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { Context, RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { MovieController } from "../../controllers/movieController.ts";
import { movieRepositoryObj, showRepositoryObj } from "../../db/repositories/index.ts";
import { Movie } from "../../db/models/movies.ts";
import { TMDBService } from "../../services/tmdbService.ts";

// Mock für Context und RouterContext
const createMockContext = (params = {}) => {
  return {
    params,
    request: {
      body: {
        json: async () => ({})
      },
      url: new URL("http://localhost/test")
    },
    response: {
      status: 0,
      body: {}
    }
  } as unknown as Context;
};

// Mock für Repositories und Services
const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  duration: 120,
  genres: ["Action"],
  description: "Test Description",
  imageUrl: "test.jpg",
  year: 2024,
  rating: 8.5
};

const mockRepositories = {
  findAll: async () => [mockMovie],
  find: async () => mockMovie,
  create: async () => mockMovie,
  update: async () => mockMovie,
  delete: async () => {},
  findByMovieId: async () => []
};

Deno.test("MovieController Tests", async (t) => {
  const controller = new MovieController();

  // Setup mocks
  movieRepositoryObj.findAll = mockRepositories.findAll;
  movieRepositoryObj.find = mockRepositories.find;
  movieRepositoryObj.create = mockRepositories.create;
  movieRepositoryObj.update = mockRepositories.update;
  movieRepositoryObj.delete = mockRepositories.delete;
  showRepositoryObj.findByMovieId = mockRepositories.findByMovieId;

  await t.step("getAll - should return all movies", async () => {
    const ctx = createMockContext();
    await controller.getAll(ctx);
    
    assertEquals(ctx.response.status, 0); // Default status
    assertEquals(ctx.response.body, [mockMovie]);
  });

  await t.step("getOne - should return one movie", async () => {
    const ctx = createMockContext({ id: "1" }) as RouterContext<"/movies/:id">;
    await controller.getOne(ctx);
    
    assertEquals(ctx.response.status, 0);
    assertEquals(ctx.response.body, mockMovie);
  });

  await t.step("create - should create movie successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      title: "New Movie",
      duration: 120
    });

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 201);
    assertEquals(ctx.response.body, mockMovie);
  });

  await t.step("create - should return 400 for missing title", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      duration: 120
    });

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Title is required" });
  });

  await t.step("update - should update movie successfully", async () => {
    const ctx = createMockContext({ id: "1" }) as RouterContext<"/movies/:id">;
    ctx.request.body.json = async () => ({
      id: 1,
      title: "Updated Movie",
      duration: 130
    });

    await controller.update(ctx);
    
    assertEquals(ctx.response.status, 0);
    assertEquals(ctx.response.body, mockMovie);
  });

  await t.step("delete - should delete movie successfully", async () => {
    const ctx = createMockContext({ id: "1" }) as RouterContext<"/movies/:id">;
    await controller.delete(ctx);
    
    assertEquals(ctx.response.status, 204);
  });

  await t.step("searchTMDB - should search movies", async () => {
    const ctx = createMockContext();
    const searchCtx = createMockContext();
    (searchCtx.request as any).url = new URL("http://localhost/movies/search?query=test");
    
    // Mock TMDBService
    TMDBService.searchMovies = async () => [mockMovie];
    
    await controller.searchTMDB(searchCtx);
    
    assertEquals(searchCtx.response.status, 0);
    assertEquals(searchCtx.response.body, [mockMovie]);
  });

  await t.step("getGenres - should return movie genres", async () => {
    const ctx = createMockContext({ id: "1" }) as RouterContext<"/movies/:id">;
    await controller.getGenres(ctx);
    
    assertEquals(ctx.response.status, 0);
    assertEquals(ctx.response.body, mockMovie.genres);
  });

  await t.step("updateGenres - should update movie genres", async () => {
    const ctx = createMockContext({ id: "1" }) as RouterContext<"/movies/:id">;
    ctx.request.body.json = async () => ({
      genres: ["Action", "Drama"]
    });

    await controller.updateGenres(ctx);
    
    assertEquals(ctx.response.status, 0);
    assertEquals(ctx.response.body, mockMovie);
  });

  await t.step("getShowsByMovieId - should return shows for movie", async () => {
    const ctx = createMockContext({ id: "1" }) as RouterContext<"/movies/:id/shows">;
    await controller.getShowsByMovieId(ctx);
    
    assertEquals(ctx.response.status, 0);
    assertEquals(ctx.response.body, []);
  });
});
