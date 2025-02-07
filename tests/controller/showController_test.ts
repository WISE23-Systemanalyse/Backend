import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { showRepositoryObj } from "../../db/repositories/shows.ts";
import { bookingRepositoryObj } from "../../db/repositories/bookings.ts";
import { seatRepositoryObj } from "../../db/repositories/seats.ts";
import { reservationServiceObj } from "../../services/reservationService.ts";
import { ShowController } from "../../controllers/showController.ts";

// Mock für RouterContext mit korrekten Typen
const createMockContext = () => {
  return {
    params: {} as Record<string, string>,
    request: {
      body: {
        json: async () => ({})
      }
    },
    response: {
      status: 0,
      body: {} as any
    }
  } as unknown as RouterContext<string>;
};

// Mock für die Repositories und Services
const mockShowRepository = {
  findAll: async () => [{ id: 1, movie_id: 1, hall_id: 1, start_time: new Date(), base_price: 10 }],
  find: async (id: number) => ({ id, movie_id: 1, hall_id: 1, start_time: new Date(), base_price: 10 }),
  create: async (data: any) => ({ id: 1, ...data }),
  update: async (id: number, data: any) => ({ id, ...data }),
  delete: async (id: number) => {},
  findAllWithDetails: async () => [{ id: 1, movie_id: 1, hall_id: 1, start_time: new Date(), base_price: 10, movieDetails: {}, hallDetails: {} }],
  findOneWithDetails: async (id: number) => ({ id, movie_id: 1, hall_id: 1, start_time: new Date(), base_price: 10, movieDetails: {}, hallDetails: {} }),
  findByHallId: async (hallId: number) => [{ id: 1, movie_id: 1, hall_id: hallId, start_time: new Date(), base_price: 10 }]
};

const mockBookingRepository = {
  getBookingsByShowId: async (id: number) => [{ id: 1, show_id: id, seat_id: 1 }]
};

const mockSeatRepository = {
  findByHallId: async (hallId: number) => [{ id: 1, hall_id: hallId, row: 1, number: 1 }]
};

const mockReservationService = {
  getReservationsByShowId: async (id: number) => [{ id: 1, show_id: id, seat_id: 2, expire_at: new Date(Date.now() + 3600000) }]
};

Deno.test("ShowController Tests", async (t) => {
  const controller = new ShowController();

  // Mock repositories and services
  Object.assign(showRepositoryObj, mockShowRepository);
  Object.assign(bookingRepositoryObj, mockBookingRepository);
  Object.assign(seatRepositoryObj, mockSeatRepository);
  Object.assign(reservationServiceObj, mockReservationService);

  await t.step("getAll - should return all shows", async () => {
    const ctx = createMockContext();
    await controller.getAll(ctx);
    const responseBody = ctx.response.body as Array<any>;
    assertEquals(responseBody[0].id, 1);
    assertEquals(responseBody[0].movie_id, 1);
    assertEquals(responseBody[0].hall_id, 1);
    assertEquals(responseBody[0].base_price, 10);
  });

  await t.step("getAllWithDetails - should return all shows with details", async () => {
    const ctx = createMockContext();
    await controller.getAllWithDetails(ctx);
    const responseBody = ctx.response.body as Array<any>;
    assertEquals(responseBody[0].movieDetails, {});
    assertEquals(responseBody[0].hallDetails, {});
  });

  await t.step("getOne - should return specific show", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    await controller.getOne(ctx as unknown as RouterContext<"/shows/:id">);
    const responseBody = ctx.response.body as any;
    assertEquals(responseBody.id, 1);
  });

  await t.step("create - should create show successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      movie_id: 1,
      hall_id: 1,
      start_time: new Date().toISOString(),
      base_price: 10
    });

    await controller.create(ctx);
    assertEquals(ctx.response.status, 201);
  });

  await t.step("update - should update show successfully", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    ctx.request.body.json = async () => ({
      id: 1,
      movie_id: 2,
      hall_id: 1,
      start_time: new Date(),
      base_price: 15
    });

    await controller.update(ctx as unknown as RouterContext<"/shows/:id">);
    assertEquals(ctx.response.status, 200);
  });

  await t.step("delete - should delete show successfully", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    await controller.delete(ctx);
    assertEquals(ctx.response.status, 204);
  });

  await t.step("getBookingsByShowId - should return bookings for show", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    await controller.getBookingsByShowId(ctx as unknown as RouterContext<"/shows/:id">);
    const responseBody = ctx.response.body as Array<any>;
    assertEquals(responseBody[0].show_id, 1);
  });

  await t.step("getSeatsWithStatus - should return seats with status", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    await controller.getSeatsWithStatus(ctx as unknown as RouterContext<"/shows/:id/seats">);
    
    const seats = ctx.response.body as Array<any>;
    assertEquals(seats.length, 1);
    assertEquals(seats[0].seat_status, "BOOKED");
  });

  await t.step("getShowsByHallId - should return shows for hall", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    await controller.getShowsByHallId(ctx as unknown as RouterContext<"/shows/hall/:id">);
    const responseBody = ctx.response.body as Array<any>;
    assertEquals(responseBody[0].hall_id, 1);
  });

  await t.step("getOne - should return 404 for non-existent show", async () => {
    const ctx = createMockContext();
    Object.assign(showRepositoryObj, {
      find: async () => null
    });
    
    ctx.params = { id: "999" };
    await controller.getOne(ctx as unknown as RouterContext<"/shows/:id">);
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "Show not found" });
  });

  await t.step("create - should return 400 for missing required fields", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      movie_id: 1
      // Missing required fields
    });

    await controller.create(ctx);
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Missing required fields" });
  });

  await t.step("getOne - sollte 400 bei fehlender ID zurückgeben", async () => {
    const ctx = createMockContext();
    await controller.getOne(ctx as unknown as RouterContext<"/shows/:id">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Id parameter is required" });
  });

  await t.step("create - sollte 400 bei ungültigem Datumsformat zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      movie_id: 1,
      hall_id: 1,
      start_time: "ungültiges-datum",
      base_price: 10
    });

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Invalid start_time format" });
  });

  await t.step("create - sollte 500 bei Datenbankfehler zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      movie_id: 1,
      hall_id: 1,
      start_time: new Date().toISOString(),
      base_price: 10
    });

    // Mock für Datenbankfehler
    showRepositoryObj.create = async () => {
      throw new Error("Database connection failed");
    };

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 500);
    assertEquals(ctx.response.body, { message: "Database connection failed" });
  });

  await t.step("update - sollte 400 bei fehlendem Request Body zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    Object.defineProperty(ctx.request, 'body', {
      value: undefined,
      writable: true
    });

    await controller.update(ctx as unknown as RouterContext<"/shows/:id">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Request body is required" });
  });

  await t.step("getSeatsWithStatus - sollte 400 bei fehlender Show-ID zurückgeben", async () => {
    const ctx = createMockContext();
    await controller.getSeatsWithStatus(ctx as unknown as RouterContext<"/shows/:id/seats">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Show ID is required" });
  });

  await t.step("getSeatsWithStatus - sollte 404 bei nicht existierender Show zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "999" };
    
    // Mock für nicht gefundene Show
    showRepositoryObj.find = async () => null;

    await controller.getSeatsWithStatus(ctx as unknown as RouterContext<"/shows/:id/seats">);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "Show not found" });
  });

  await t.step("getBookingsByShowId - sollte 400 bei fehlender ID zurückgeben", async () => {
    const ctx = createMockContext();
    await controller.getBookingsByShowId(ctx as unknown as RouterContext<"/shows/:id">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Id parameter is required" });
  });

  await t.step("getBookingsByShowId - sollte 404 bei nicht existierender Show zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "999" };
    
    // Mock für nicht gefundene Show
    showRepositoryObj.find = async () => null;

    await controller.getBookingsByShowId(ctx as unknown as RouterContext<"/shows/:id">);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "Show not found" });
  });

  await t.step("delete - sollte 400 bei fehlender ID zurückgeben", async () => {
    const ctx = createMockContext();
    await controller.delete(ctx);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Id parameter is required" });
  });
});
