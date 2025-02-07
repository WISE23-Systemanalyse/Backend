import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { HallController } from "../../controllers/hallController.ts";
import { hallRepositoryObj } from "../../db/repositories/halls.ts";
import { seatRepositoryObj } from "../../db/repositories/seats.ts";
import { Hall } from "../../db/models/halls.ts";
import { Seat } from "../../db/models/seats.ts";

// Mock für RouterContext
const createMockContext = (params = {}) => {
  return {
    params,
    request: {
      body: {
        json: async () => ({})
      }
    },
    response: {
      status: 0,
      body: {} as Record<string, unknown> | Hall[] | Hall | Seat[]
    }
  } as unknown as RouterContext<"/halls" | "/halls/:id" | "/halls/:id/seats">;
};

// Mock Daten
const mockHall: Hall = {
  id: 1,
  name: "Test Hall",
  seating_capacity: 100
};

// Mock für Repository
const mockHallRepository = {
  findAll: async () => [mockHall],
  find: async (id: number) => id === 1 ? mockHall : null,
  create: async (hall: { name: string; seating_capacity: number | null }) => ({
    id: 1,
    name: hall.name,
    seating_capacity: hall.seating_capacity
  }),
  update: async (id: number, hall: { name: string; seating_capacity: number | null }) => ({
    id,
    name: hall.name,
    seating_capacity: hall.seating_capacity
  }),
  delete: async () => {}
};

const mockSeatRepository = {
  findByHallId: async () => [{
    id: 1,
    hall_id: 1,
    row_number: 1,
    seat_number: 1,
    category_id: 1
  }]
};

Deno.test("HallController Tests", async (t) => {
  const controller = new HallController();

  // Repository mocks setzen
  hallRepositoryObj.findAll = mockHallRepository.findAll;
  hallRepositoryObj.find = mockHallRepository.find;
  hallRepositoryObj.create = mockHallRepository.create;
  hallRepositoryObj.update = mockHallRepository.update;
  hallRepositoryObj.delete = mockHallRepository.delete;
  seatRepositoryObj.findByHallId = mockSeatRepository.findByHallId;

  await t.step("getAll - should return all halls", async () => {
    const ctx = createMockContext();
    await controller.getAll(ctx as RouterContext<"/halls">);
    
    assertEquals((ctx.response.body as Hall[])[0], mockHall);
  });

  await t.step("getOne - should return one hall", async () => {
    const ctx = createMockContext({ id: "1" });
    await controller.getOne(ctx as RouterContext<"/halls/:id">);
    
    assertEquals(ctx.response.body as Hall, mockHall);
  });

  await t.step("getOne - should return 404 for non-existent hall", async () => {
    const ctx = createMockContext({ id: "999" });
    await controller.getOne(ctx as RouterContext<"/halls/:id">);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "Hall not found" });
  });

  await t.step("getSeats - should return seats for a hall", async () => {
    const ctx = createMockContext({ id: "1" });
    await controller.getSeats(ctx as RouterContext<"/halls/:id/seats">);
    
    const seats = ctx.response.body as Seat[];
    assertEquals(seats[0].hall_id, 1);
  });

  await t.step("create - should create hall successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      name: "New Hall",
      seating_capacity: 200
    });

    await controller.create(ctx as RouterContext<"/halls">);
    
    assertEquals(ctx.response.status, 201);
    assertEquals((ctx.response.body as Hall).name, "New Hall");
  });

  await t.step("create - should return 400 for invalid input", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      name: "New Hall"
      // seating_capacity missing
    });

    await controller.create(ctx as RouterContext<"/halls">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Invalid JSON" });
  });

  await t.step("update - should update hall successfully", async () => {
    const ctx = createMockContext({ id: "1" });
    ctx.request.body.json = async () => ({
      name: "Updated Hall",
      seating_capacity: 300
    });

    await controller.update(ctx as RouterContext<"/halls/:id">);
    
    assertEquals((ctx.response.body as Hall).name, "Updated Hall");
  });


  await t.step("delete - should delete hall successfully", async () => {
    const ctx = createMockContext({ id: "1" });
    await controller.delete(ctx as RouterContext<"/halls/:id">);
    
    assertEquals(ctx.response.status, 204);
  });

  await t.step("delete - should return 404 for non-existent hall", async () => {
    const ctx = createMockContext({ id: "999" });
    await controller.delete(ctx as RouterContext<"/halls/:id">);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "Hall not found" });
  });
});
