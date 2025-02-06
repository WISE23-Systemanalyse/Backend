import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { BookingController } from "../../controllers/bookingController.ts";
import { bookingRepositoryObj } from "../../db/repositories/bookings.ts";

// Mock booking data
const mockBooking = {
  id: 123,
  email: null,
  user_id: null,
  show_id: 456,
  seat_id: 789,
  booking_time: new Date(),
  payment_id: 101112,
  token: "token123"
};

// Mock context creation helper
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
      body: {}
    }
  };
};

// Spy function types
type BookingType = {
  id: number;
  email: string | null;
  user_id: string | null;
  show_id: number;
  seat_id: number;
  booking_time: Date | null;
  payment_id: number;
  token: string;
};

type SpyFunction<T> = {
  called: boolean;
  lastCall?: any;
} & T;

// Mock repository
const mockBookingRepository = {
  findAll: jest.fn(async () => [] as BookingType[]) as unknown as SpyFunction<() => Promise<BookingType[]>>,
  find: jest.fn(async () => null) as unknown as SpyFunction<(id: number) => Promise<BookingType | null>>,
  create: async (data: any) => ({ ...mockBooking, ...data }),
  update: async (id: number, data: any) => ({ ...mockBooking, ...data }),
  delete: async (id: number) => true,
  getBookingsByShowId: async (id: number) => [mockBooking],
  getBookingsByUserId: async (id: string) => [mockBooking],
  getBookingsByPaymentId: async (id: number) => [mockBooking],
  getAllBookingDetails: async () => [{ ...mockBooking, show: {}, user: {} }]
};

// Initialize spy properties
(mockBookingRepository.findAll as SpyFunction<() => Promise<BookingType[]>>).called = false;
(mockBookingRepository.find as SpyFunction<(id: number) => Promise<BookingType | null>>).called = false;
(mockBookingRepository.find as SpyFunction<(id: number) => Promise<BookingType | null>>).lastCall = null;

// Test
Deno.test("BookingController - getAll success", async () => {
  const controller = new BookingController();
  const ctx = createMockContext();
  
  const originalRepo = bookingRepositoryObj.findAll;
  bookingRepositoryObj.findAll = mockBookingRepository.findAll;

  await controller.getAll(ctx as any);
  
  assertEquals(mockBookingRepository.findAll.called, true);
  assertEquals(ctx.response.body, []);

  bookingRepositoryObj.findAll = originalRepo;
});

Deno.test("BookingController - getOne not found", async () => {
  const controller = new BookingController();
  const ctx = createMockContext({ id: "nonexistent" });
  
  const originalFind = bookingRepositoryObj.find;
  bookingRepositoryObj.find = async () => null;

  await controller.getOne(ctx as any);

  assertEquals(ctx.response.status, 404);
  assertEquals(ctx.response.body, { message: "Booking not found" });

  bookingRepositoryObj.find = originalFind;
});

Deno.test("BookingController - create success", async () => {
  const controller = new BookingController();
  const ctx = createMockContext();
  
  const newBookingData = {
    show_id: "show123",
    user_id: "user123",
    payment_id: "payment123"
  };

  ctx.request.body.json = async () => newBookingData;
  
  const originalCreate = bookingRepositoryObj.create;
  bookingRepositoryObj.create = mockBookingRepository.create;

  await controller.create(ctx as any);

  assertEquals(ctx.response.status, 201);
  assertEquals(ctx.response.body.show_id, newBookingData.show_id);
  assertEquals(ctx.response.body.user_id, newBookingData.user_id);

  bookingRepositoryObj.create = originalCreate;
});

Deno.test("BookingController - update success", async () => {
  const controller = new BookingController();
  const ctx = createMockContext({ id: "123" });
  
  const updateData = {
    id: "123",
    show_id: "show123",
    user_id: "user123",
    payment_id: "payment123_updated"
  };

  ctx.request.body.json = async () => updateData;
  
  const originalUpdate = bookingRepositoryObj.update;
  bookingRepositoryObj.update = mockBookingRepository.update;

  await controller.update(ctx as any);

  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body.payment_id, updateData.payment_id);

  bookingRepositoryObj.update = originalUpdate;
});

Deno.test("BookingController - delete success", async () => {
  const controller = new BookingController();
  const ctx = createMockContext({ id: "123" });
  
  const originalFind = bookingRepositoryObj.find;
  const originalDelete = bookingRepositoryObj.delete;
  bookingRepositoryObj.find = mockBookingRepository.find;
  bookingRepositoryObj.delete = mockBookingRepository.delete;

  await controller.delete(ctx as any);

  assertEquals(ctx.response.status, 204);

  bookingRepositoryObj.find = originalFind;
  bookingRepositoryObj.delete = originalDelete;
});

Deno.test("BookingController - getBookingsByShowId success", async () => {
  const controller = new BookingController();
  const ctx = createMockContext({ id: "show123" });
  
  const originalGetByShowId = bookingRepositoryObj.getBookingsByShowId;
  bookingRepositoryObj.getBookingsByShowId = mockBookingRepository.getBookingsByShowId;

  await controller.getBookingsByShowId(ctx as any);

  assertEquals(ctx.response.body, [mockBooking]);

  bookingRepositoryObj.getBookingsByShowId = originalGetByShowId;
});

Deno.test("BookingController - getBookingsByUserId success", async () => {
  const controller = new BookingController();
  const ctx = createMockContext({ id: "user123" });
  
  const originalGetByUserId = bookingRepositoryObj.getBookingsByUserId;
  bookingRepositoryObj.getBookingsByUserId = mockBookingRepository.getBookingsByUserId;

  await controller.getBookingsByUserId(ctx as any);

  assertEquals(ctx.response.body, [mockBooking]);

  bookingRepositoryObj.getBookingsByUserId = originalGetByUserId;
});

Deno.test("BookingController - getByPaymentId success", async () => {
  const controller = new BookingController();
  const ctx = createMockContext({ paymentId: "payment123" });
  
  const originalGetByPaymentId = bookingRepositoryObj.getBookingsByPaymentId;
  bookingRepositoryObj.getBookingsByPaymentId = mockBookingRepository.getBookingsByPaymentId;

  await controller.getByPaymentId(ctx as any);

  assertEquals(ctx.response.body, [mockBooking]);

  bookingRepositoryObj.getBookingsByPaymentId = originalGetByPaymentId;
});

Deno.test("BookingController - getByPaymentId not found", async () => {
  const controller = new BookingController();
  const ctx = createMockContext({ paymentId: "nonexistent" });
  
  const originalGetByPaymentId = bookingRepositoryObj.getBookingsByPaymentId;
  bookingRepositoryObj.getBookingsByPaymentId = async () => [];

  await controller.getByPaymentId(ctx as any);

  assertEquals(ctx.response.status, 404);
  assertEquals(ctx.response.body, { message: "No bookings found for this payment" });

  bookingRepositoryObj.getBookingsByPaymentId = originalGetByPaymentId;
}); 