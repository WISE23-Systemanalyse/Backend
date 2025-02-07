import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { ShowRepository } from "../../../db/repositories/shows.ts";
import { db } from "../../../db/db.ts";
import { Show } from "../../../db/models/shows.ts";

// Mock data for tests
const mockShows: Show[] = [
  { 
    id: 1,
    movie_id: 1,
    hall_id: 1,
    start_time: new Date('2024-03-20T18:00:00'),
    base_price: 10.99
  },
  { 
    id: 2,
    movie_id: 1,
    hall_id: 2,
    start_time: new Date('2024-03-21T20:00:00'),
    base_price: 12.99
  }
];

const mockShowWithDetails = {
  id: 1,
  movie_id: 1,
  hall_id: 1,
  start_time: new Date('2024-03-20T18:00:00'),
  base_price: 10.99,
  title: 'Test Movie',
  description: 'Test Description',
  image_url: 'test.jpg',
  name: 'Hall 1'
};

Deno.test('ShowRepository - findAll', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => mockShows
  }) as any;

  try {
    const repository = new ShowRepository();
    const result = await repository.findAll();

    assertExists(result);
    assertEquals(result.length, 2);
    assertEquals(result[0].movie_id, 1);
    assertEquals(result[0].hall_id, 1);
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('ShowRepository - findAllWithDetails', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      leftJoin: () => ({
        leftJoin: () => ({
          where: () => ({
            orderBy: () => [mockShowWithDetails]
          })
        })
      })
    })
  }) as any;

  try {
    const repository = new ShowRepository();
    const result = await repository.findAllWithDetails();

    assertExists(result);
    assertEquals(result[0].title, 'Test Movie');
    assertEquals(result[0].name, 'Hall 1');
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('ShowRepository - findOneWithDetails', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      leftJoin: () => ({
        leftJoin: () => ({
          where: () => [mockShowWithDetails]
        })
      })
    })
  }) as any;

  try {
    const repository = new ShowRepository();
    const result = await repository.findOneWithDetails(1);

    assertExists(result);
    assertEquals(result.title, 'Test Movie');
    assertEquals(result.name, 'Hall 1');
    assertEquals(result.base_price, 10.99);
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('ShowRepository - create', async () => {
  const newShow = {
    movie_id: 2,
    hall_id: 3,
    start_time: new Date('2024-03-22T19:00:00'),
    base_price: 11.99
  };
  
  const originalInsert = db.insert;
  db.insert = () => ({
    values: () => ({
      returning: () => [{
        id: 3,
        ...newShow
      }]
    })
  }) as any;

  try {
    const repository = new ShowRepository();
    const result = await repository.create(newShow);

    assertExists(result);
    assertEquals(result.movie_id, 2);
    assertEquals(result.hall_id, 3);
    assertEquals(result.base_price, 11.99);
    assertExists(result.id);
  } finally {
    db.insert = originalInsert;
  }
});

Deno.test('ShowRepository - update', async () => {
  const updatedShow = {
    movie_id: 2,
    hall_id: 2,
    start_time: new Date('2024-03-23T21:00:00'),
    base_price: 13.99
  };
  
  const originalUpdate = db.update;
  db.update = () => ({
    set: () => ({
      where: () => ({
        returning: () => [{
          id: 1,
          ...updatedShow
        }]
      })
    })
  }) as any;

  try {
    const repository = new ShowRepository();
    const result = await repository.update(1, updatedShow);

    assertExists(result);
    assertEquals(result.movie_id, 2);
    assertEquals(result.base_price, 13.99);
  } finally {
    db.update = originalUpdate;
  }
});

Deno.test('ShowRepository - findByMovieId', async () => {
  const mockShowsByMovie = [
    {
      show_id: 1,
      hall_id: 1,
      hall_name: 'Hall 1',
      start_time: new Date('2024-03-20T18:00:00')
    }
  ];

  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      leftJoin: () => ({
        leftJoin: () => ({
          where: () => ({
            orderBy: () => mockShowsByMovie
          })
        })
      })
    })
  }) as any;

  try {
    const repository = new ShowRepository();
    const result = await repository.findByMovieId(1);

    assertExists(result);
    assertEquals(result[0].hall_name, 'Hall 1');
    assertEquals(result[0].show_id, 1);
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('ShowRepository - findByHallId', async () => {
  const mockShowsByHall = [
    {
      show_id: 1,
      movie_id: 1,
      hall_id: 1,
      start_time: new Date('2024-03-20T18:00:00'),
      title: 'Test Movie',
      description: 'Test Description',
      image_url: 'test.jpg'
    }
  ];

  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      leftJoin: () => ({
        where: () => mockShowsByHall
      })
    })
  }) as any;

  try {
    const repository = new ShowRepository();
    const result = await repository.findByHallId(1);

    assertExists(result);
    assertEquals(result[0].title, 'Test Movie');
    assertEquals(result[0].show_id, 1);
  } finally {
    db.select = originalSelect;
  }
}); 