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
  } as unknown as RouterContext<"/bookings" | "/bookings/:id" | "/bookings/show/:id" | "/bookings/user/:id" | "/bookings/details" | "/bookings/payment/:paymentId">;
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
    await controller.getAll(ctx as RouterContext<"/bookings">);
    
    assertEquals(ctx.response.body, [{ id: 1, show_id: 1, user_id: "user1" }]);
  });

  await t.step("getOne - should return specific booking", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };

    await controller.getOne(ctx as RouterContext<"/bookings/:id">);
    
    assertEquals(ctx.response.body, { id: 1, show_id: 1, user_id: "user1" });
  });

  await t.step("create - should create booking successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      show_id: 1,
      user_id: "user1"
    });

    await controller.create(ctx as RouterContext<"/bookings">);
    
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

    await controller.update(ctx as RouterContext<"/bookings/:id">);
    
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, { id: 1, show_id: 2, user_id: "user1" });
  });

  await t.step("delete - should delete booking successfully", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };

    await controller.delete(ctx as RouterContext<"/bookings/:id">);
    
    assertEquals(ctx.response.status, 204);
  });

  await t.step("getBookingsByShowId - should return bookings for show", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };

    await controller.getBookingsByShowId(ctx as RouterContext<"/bookings/show/:id">);
    
    assertEquals(ctx.response.body, [{ id: 1, show_id: 1, user_id: "user1" }]);
  });

  await t.step("getBookingsByUserId - should return bookings for user", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "user1" };

    await controller.getBookingsByUserId(ctx as RouterContext<"/bookings/user/:id">);
    
    assertEquals(ctx.response.body, [{ id: 1, show_id: 1, user_id: "user1" }]);
  });

  await t.step("getByPaymentId - should return bookings for payment", async () => {
    const ctx = createMockContext();
    ctx.params = { paymentId: "1" };

    await controller.getByPaymentId(ctx as RouterContext<"/bookings/payment/:paymentId">);
    
    assertEquals(ctx.response.body, [{ id: 1, show_id: 1, user_id: "user1", payment_id: 1 }]);
  });

  await t.step("getByPaymentId - should return 400 for missing payment ID", async () => {
    const ctx = createMockContext();
    
    await controller.getByPaymentId(ctx as RouterContext<"/bookings/payment/:paymentId">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Payment ID is required" });
  });
});