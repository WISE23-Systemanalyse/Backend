import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { bookingRepositoryObj } from "../../db/repositories/bookings.ts";
import { BookingController } from "../../controllers/bookingController.ts";

// Mock für RouterContext
const createMockContext = () => {
  return {
    params: {},
    request: {
      body: {
        json: async () => ({})
      }
    },
    response: {
      status: 0,
      body: {}
    }
  } as unknown as RouterContext<string>;
};

// Mock für bookingRepositoryObj
const mockBookingRepository = {
  findAll: async () => [{ id: 1, show_id: 1, user_id: "user1" }],
  find: async (id: number) => ({ id, show_id: 1, user_id: "user1" }),
  create: async (data: any) => ({ id: 1, ...data }),
  update: async (id: number, data: any) => ({ id, ...data }),
  delete: async (id: number) => {},
  getBookingsByShowId: async (id: number) => [{ id: 1, show_id: id, user_id: "user1" }],
  getBookingsByUserId: async (id: string) => [{ id: 1, show_id: 1, user_id: id }],
  getAllBookingDetails: async () => [{ id: 1, show_id: 1, user_id: "user1", showDetails: {} }],
  getBookingsByPaymentId: async (paymentId: number) => [{ id: 1, show_id: 1, user_id: "user1", payment_id: paymentId }]
};

Deno.test("BookingController Tests", async (t) => {
  const controller = new BookingController();

  // Mock repository methods
  Object.assign(bookingRepositoryObj, mockBookingRepository);

  await t.step("getAll - should return all bookings", async () => {
    const ctx = createMockContext();
    await controller.getAll(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.body, [{ id: 1, show_id: 1, user_id: "user1" }]);
  });

  await t.step("getOne - should return specific booking", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };

    await controller.getOne(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.body, { id: 1, show_id: 1, user_id: "user1" });
  });

  await t.step("create - should create booking successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      show_id: 1,
      user_id: "user1"
    });

    await controller.create(ctx as unknown as RouterContext<string>);
    
    assertEquals(ctx.response.status, 201);
    assertEquals(ctx.response.body, { id: 1, show_id: 1, user_id: "user1" });
  });

  await t.step("update - should update booking successfully", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    ctx.request.body.json = async () => ({
      id: 1,
      show_id: 2,
      user_id: "user1"
    });

    await controller.update(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, { id: 1, show_id: 2, user_id: "user1" });
  });

  await t.step("delete - should delete booking successfully", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };

    await controller.delete(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 204);
  });

  await t.step("getBookingsByShowId - should return bookings for show", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };

    await controller.getBookingsByShowId(ctx as unknown as RouterContext<string>);
    
    assertEquals(ctx.response.body, [{ id: 1, show_id: 1, user_id: "user1" }]);
  });

  await t.step("getBookingsByUserId - should return bookings for user", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "user1" };

    await controller.getBookingsByUserId(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.body, [{ id: 1, show_id: 1, user_id: "user1" }]);
  });

  await t.step("getByPaymentId - should return bookings for payment", async () => {
    const ctx = createMockContext();
    ctx.params = { paymentId: "1" };

    await controller.getByPaymentId(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.body, [{ id: 1, show_id: 1, user_id: "user1", payment_id: 1 }]);
  });

  await t.step("getByPaymentId - should return 400 for missing payment ID", async () => {
    const ctx = createMockContext();
    
    await controller.getByPaymentId(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Payment ID is required" });
  });

  await t.step("getOne - sollte 404 bei nicht gefundener Buchung zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "999" };
    
    // Mock für nicht gefundene Buchung
    bookingRepositoryObj.find = async () => null;

    await controller.getOne(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "Booking not found" });
  });

  await t.step("create - sollte 400 bei fehlendem Request Body zurückgeben", async () => {
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, 'body', {
      value: undefined,
      writable: true
    });

    await controller.create(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Request body is required" });
  });

  await t.step("create - sollte 400 bei ungültigem JSON zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => {
      throw new Error("Invalid JSON");
    };

    await controller.create(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Invalid JSON" });
  });

  await t.step("update - sollte 400 bei fehlender ID zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = {}; // keine ID

    await controller.update(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Id parameter is required" });
  });

  await t.step("update - sollte 400 bei fehlenden Pflichtfeldern zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    ctx.request.body.json = async () => ({
      // Fehlende Pflichtfelder
      id: 1
    });

    await controller.update(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "BookingId, showId and userId are required" });
  });

  await t.step("delete - sollte 404 bei nicht gefundener Buchung zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "999" };
    
    // Mock für nicht gefundene Buchung
    bookingRepositoryObj.find = async () => null;

    await controller.delete(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "Booking not found" });
  });

  await t.step("getBookingsByShowId - sollte 400 bei fehlender Show-ID zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = {}; // keine ID

    await controller.getBookingsByShowId(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Id parameter is required" });
  });

  await t.step("getBookingsByUserId - sollte 400 bei fehlender User-ID zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = {}; // keine ID

    await controller.getBookingsByUserId(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Id parameter is required" });
  });

  await t.step("getByPaymentId - sollte 404 bei nicht gefundenen Buchungen zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = { paymentId: "999" };
    
    // Mock für keine Buchungen
    bookingRepositoryObj.getBookingsByPaymentId = async () => [];

    await controller.getByPaymentId(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "No bookings found for this payment" });
  });

  await t.step("getByPaymentId - sollte 500 bei Datenbankfehler zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = { paymentId: "1" };
    
    // Mock für Datenbankfehler
    bookingRepositoryObj.getBookingsByPaymentId = async () => {
      throw new Error("Database connection failed");
    };

    await controller.getByPaymentId(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 500);
    assertEquals(ctx.response.body, { message: "Database connection failed" });
  });
});
