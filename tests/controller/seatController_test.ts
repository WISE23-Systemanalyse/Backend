import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { SeatController } from "../../controllers/seatController.ts";
import { RouterContext } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { Context } from "https://deno.land/x/oak@v17.1.4/context.ts";
import { seatRepositoryObj } from "../../db/repositories/seats.ts";
import { Seat } from "../../db/models/seats.ts";

const mockSeat: Seat = {
  id: 1,
  hall_id: 1,
  row_number: 1,
  seat_number: 1,
  category_id: 1,
};

const mockSeats: Seat[] = [
  mockSeat,
  {
    id: 2,
    hall_id: 1,
    row_number: 1,
    seat_number: 2,
    category_id: 1,
  },
];

// Mock the repository
const mockSeatRepository = {
  findAll: async () => mockSeats,
  find: async (id: number) => mockSeat,
  create: async (seat: Seat) => ({ ...seat, id: 1 }),
  update: async (id: number, seat: Seat) => ({ ...seat, id }),
  delete: async (id: number) => undefined,
  deleteByHallId: async (hallId: number) => undefined,
};

// Replace the real repository with mock
(seatRepositoryObj as any) = mockSeatRepository;

// Helper function to create mock context
function createMockContext(params = {}, requestBody: any = null): RouterContext<string> {
  return {
    params,
    response: {
      status: 0,
      body: null,
    },
    request: {
      body: {
        value: requestBody,
        json: async () => requestBody,
      },
    },
  } as unknown as RouterContext<string>;
}

Deno.test("SeatController Tests", async (t) => {
  const controller = new SeatController();

  await t.step("getAll - should return all seats", async () => {
    const ctx = createMockContext();
    await controller.getAll(ctx);
    assertEquals(ctx.response.body, mockSeats);
  });

  await t.step("getOne - should return a single seat", async () => {
    const ctx = createMockContext({ id: "1" });
    await controller.getOne(ctx);
    assertEquals(ctx.response.body, mockSeat);
  });

  await t.step("getOne - should handle missing id", async () => {
    const ctx = createMockContext();
    await controller.getOne(ctx);
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Id parameter is required" });
  });

  await t.step("create - should create a new seat", async () => {
    const newSeat: Partial<Seat> = {
      hall_id: 1,
      row_number: 2,
      seat_number: 3,
      category_id: 1,
    };
    const ctx = createMockContext({}, newSeat);
    await controller.create(ctx);
    assertEquals(ctx.response.status, 201);
    const responseBody = ctx.response.body as Seat;
    assertExists(responseBody.id);
  });

  await t.step("create - should handle missing required fields", async () => {
    const invalidSeat: Partial<Seat> = {
      hall_id: 1,
    };
    const ctx = createMockContext({}, invalidSeat);
    await controller.create(ctx);
    assertEquals(ctx.response.status, 400);
  });

  await t.step("update - should update an existing seat", async () => {
    const updatedSeat: Seat = {
      id: 1,
      hall_id: 1,
      row_number: 2,
      seat_number: 3,
      category_id: 1,
    };
    const ctx = createMockContext({ id: "1" }, updatedSeat);
    await controller.update(ctx);
    assertEquals(ctx.response.status, 200);
    const responseBody = ctx.response.body as Seat;
    assertEquals(responseBody.id, 1);
  });

  await t.step("delete - should delete a seat", async () => {
    const ctx = createMockContext({ id: "1" }) as unknown as Context;
    await controller.delete(ctx);
    assertEquals(ctx.response.status, 204);
  });

  await t.step("bulkCreate - should create multiple seats", async () => {
    const newSeats: Partial<Seat>[] = [
      {
        hall_id: 1,
        row_number: 1,
        seat_number: 1,
        category_id: 1,
      },
      {
        hall_id: 1,
        row_number: 1,
        seat_number: 2,
        category_id: 1,
      },
    ];
    const ctx = createMockContext({}, newSeats);
    await controller.bulkCreate(ctx as unknown as RouterContext<"/seats/bulk">);
    assertEquals(ctx.response.status, 201);
    const responseBody = ctx.response.body as Seat[];
    assertExists(responseBody);
  });

  await t.step("syncHallSeats - should sync hall seats", async () => {
    const newSeats: Partial<Seat>[] = [
      {
        row_number: 1,
        seat_number: 1,
        category_id: 1,
      },
      {
        row_number: 1,
        seat_number: 2,
        category_id: 1,
      },
    ];
    const ctx = createMockContext({ hallId: "1" }, newSeats);
    await controller.syncHallSeats(ctx as unknown as RouterContext<"/seats/halls/:hallId/sync">);
    assertEquals(ctx.response.status, 201);
    const responseBody = ctx.response.body as Seat[];
    assertExists(responseBody);
  });

  await t.step("reserve - should reserve a seat", async () => {
    const reservationData = {
      user_id: 1,
      show_id: 1,
      seats: [1],
    };
    const ctx = createMockContext({ id: "1" }, reservationData);
    await controller.reserve(ctx);
    assertEquals(ctx.response.status, 201);
  });
});
