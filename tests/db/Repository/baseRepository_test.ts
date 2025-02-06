import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { BaseRepository } from '../../../db/repositories/baseRepository.ts';
import { mockChain, mockDb, mockEntity, mockTable, TestEntity } from "../../mocks/baseRepositoryMocks.ts";

Deno.test("BaseRepository.find should return null if entity not found", async () => {
  const emptyMockChain = {
    ...mockChain,
    returning: () => Promise.resolve([])
  };
  const emptyMockDb = {
    ...mockDb,
    select: () => emptyMockChain
  };
  
  const repository = new BaseRepository<TestEntity>(mockTable);
  const result = await repository.find(999);
  assertEquals(result, null);
});

Deno.test("BaseRepository.create should create and return new entity", async () => {
  const repository = new BaseRepository<TestEntity>(mockTable);
  const newEntity = { name: 'New Entity' };
  const result = await repository.create(newEntity);
  assertEquals(result, mockEntity);
});

Deno.test("BaseRepository.update should update and return entity", async () => {
  const repository = new BaseRepository<TestEntity>(mockTable);
  const updateData = { name: 'Updated Entity' };
  const result = await repository.update(1, updateData);
  assertEquals(result, mockEntity);
});

Deno.test("BaseRepository.delete should not throw error", async () => {
  const repository = new BaseRepository<TestEntity>(mockTable);
  // @ts-ignore - Für Tests überschreiben wir die protected db
  repository.db = mockDb;
  await repository.delete(1);
  // Wenn keine Exception geworfen wird, war der Test erfolgreich
});

Deno.test("BaseRepository.findAll should return all entities", async () => {
  const mockEntities = [
    { id: 1, name: "Entity 1" },
    { id: 2, name: "Entity 2" }
  ];

  const findAllMockChain = {
    from: () => Promise.resolve(mockEntities),
    where: () => findAllMockChain,
    values: () => findAllMockChain,
    set: () => findAllMockChain,
    returning: () => Promise.resolve(mockEntities)
  };

  const findAllMockDb = {
    select: () => findAllMockChain
  };

  const repository = new BaseRepository<TestEntity>(mockTable);
  const result = await repository.findAll();
  assertEquals(result, mockEntities);
});

Deno.test("BaseRepository.find should return entity by id", async () => {
  const findOneMockChain = {
    from: () => findOneMockChain,
    where: () => Promise.resolve([mockEntity]),
    values: () => findOneMockChain,
    set: () => findOneMockChain,
    returning: () => Promise.resolve([mockEntity])
  };

  const findOneMockDb = {
    select: () => findOneMockChain
  };

  const repository = new BaseRepository<TestEntity>(mockTable);
  const result = await repository.find(1);
  assertEquals(result, mockEntity);
});
