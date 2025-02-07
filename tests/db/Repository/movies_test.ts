import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { MovieRepository } from "../../../db/repositories/movies.ts";
import { db } from "../../../db/db.ts";
import { Movie } from "../../../db/models/movies.ts";

// Mock data for tests
const mockMovies: Movie[] = [
  { 
    id: 1,
    title: 'Test Movie 1',
    description: 'Description 1',
    duration: 120,
    imageUrl: 'image1.jpg',
    year: 2024,
    rating: 8.5,
    genres: ['Action']
  },
  { 
    id: 2,
    title: 'Test Movie 2',
    description: 'Description 2',
    duration: 90,
    imageUrl: 'image2.jpg',
    year: 2024,
    rating: 7.5,
    genres: ['Comedy']
  }
];

Deno.test('MovieRepository - findAll', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => mockMovies
  }) as any;

  try {
    const repository = new MovieRepository();
    const result = await repository.findAll();

    assertExists(result);
    assertEquals(result.length, 2);
    assertEquals(result[0].title, 'Test Movie 1');
    assertEquals(result[0].duration, 120);
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('MovieRepository - find by id', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      where: () => [mockMovies[0]]
    })
  }) as any;

  try {
    const repository = new MovieRepository();
    const result = await repository.find(1);

    assertExists(result);
    assertEquals(result.title, 'Test Movie 1');
    assertEquals(result.genres[0], 'Action');
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('MovieRepository - create', async () => {
  const newMovie = {
    title: 'New Movie',
    description: 'New Description',
    duration: 150,
    imageUrl: 'new-image.jpg',
    year: 2024,
    rating: 9.0,
    genres: ['Drama']
  };
  
  const originalInsert = db.insert;
  db.insert = () => ({
    values: () => ({
      returning: () => [{
        id: 3,
        ...newMovie
      }]
    })
  }) as any;

  try {
    const repository = new MovieRepository();
    const result = await repository.create(newMovie);

    assertExists(result);
    assertEquals(result.title, 'New Movie');
    assertEquals(result.duration, 150);
    assertEquals(result.genres[0], 'Drama');
  } finally {
    db.insert = originalInsert;
  }
});

Deno.test('MovieRepository - update', async () => {
  const updatedMovie = {
    title: 'Updated Movie',
    description: 'Updated Description',
    duration: 110,
    imageUrl: 'updated-image.jpg',
    year: 2024,
    rating: 8.0,
    genres: ['Horror']
  };
  
  const originalUpdate = db.update;
  db.update = () => ({
    set: () => ({
      where: () => ({
        returning: () => [{
          id: 1,
          ...updatedMovie
        }]
      })
    })
  }) as any;

  try {
    const repository = new MovieRepository();
    const result = await repository.update(1, updatedMovie);

    assertExists(result);
    assertEquals(result.title, 'Updated Movie');
    assertEquals(result.duration, 110);
    assertEquals(result.genres[0], 'Horror');
  } finally {
    db.update = originalUpdate;
  }
});

Deno.test('MovieRepository - delete', async () => {
  const originalDelete = db.delete;
  db.delete = () => ({
    where: () => Promise.resolve()
  }) as any;

  try {
    const repository = new MovieRepository();
    await repository.delete(1);
    // If no error is thrown, the test passes
  } finally {
    db.delete = originalDelete;
  }
}); 