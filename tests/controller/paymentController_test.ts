import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { PaymentController } from "../../controllers/paymentController.ts";
import { paymentRepositoryObj } from "../../db/repositories/index.ts";
import { payPalServiceObj } from "../../services/payPalService.ts";
import { showRepositoryObj } from "../../db/repositories/shows.ts";
import { seatRepositoryObj } from "../../db/repositories/seats.ts";
import { categoryRepositoryObj } from "../../db/repositories/categories.ts";
import { bookingRepositoryObj } from "../../db/repositories/bookings.ts";

// Update the mock context type
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
    },
    matched: []
  } as unknown as RouterContext<any>;
};

// Mock Daten
const mockPayment = {
  id: 1,
  amount: 100,
  tax: 19,
  payment_method: "PayPal",
  payment_status: "completed",
  payment_time: new Date(),
  time_of_payment: new Date()
};

// Update mock repository types to match expected interfaces
const mockRepositories = {
  payment: {
    findAll: async () => [mockPayment],
    find: async (id: number) => mockPayment,
    create: async () => mockPayment,
    update: async (id: number, data: any) => mockPayment,
    delete: async (id: number): Promise<void> => {}
  },
  show: {
    find: async (id: number) => ({ 
      id: 1,
      movie_id: 1,
      hall_id: 1,
      start_time: new Date(),
      base_price: 50 
    })
  },
  seat: {
    find: async (id: number) => ({ 
      id: 1,
      hall_id: 1,
      row_number: 1,
      seat_number: 1,
      category_id: 1 
    })
  },
  category: {
    find: async (id: number) => ({
      id: 1,
      category_name: "Standard",
      surcharge: 10
    })
  },
  booking: {
    create: async (data: any) => ({
      id: 1,
      user_id: null,
      email: null,
      show_id: 1,
      seat_id: 1,
      booking_time: new Date(),
      payment_id: 1,
      token: "token123"
    })
  }
};

// Update PayPal mock to include required fields
const mockPayPalOrder = {
  id: "ORDER123",
  status: "CREATED",
  links: []
};

const mockPayPalService = {
  createOrder: async () => mockPayPalOrder,
  captureOrder: async () => ({
    purchase_units: [{
      payments: {
        captures: [{
          amount: { value: "100.00" }
        }]
      }
    }]
  })
};

Deno.test("PaymentController Tests", async (t) => {
  const controller = new PaymentController();

  // Setup mocks
  paymentRepositoryObj.findAll = mockRepositories.payment.findAll;
  paymentRepositoryObj.find = mockRepositories.payment.find;
  paymentRepositoryObj.create = mockRepositories.payment.create;
  paymentRepositoryObj.update = mockRepositories.payment.update;
  paymentRepositoryObj.delete = mockRepositories.payment.delete;
  
  showRepositoryObj.find = mockRepositories.show.find;
  seatRepositoryObj.find = mockRepositories.seat.find;
  categoryRepositoryObj.find = mockRepositories.category.find;
  bookingRepositoryObj.create = mockRepositories.booking.create;
  
  payPalServiceObj.createOrder = mockPayPalService.createOrder;
  payPalServiceObj.captureOrder = mockPayPalService.captureOrder;

  await t.step("getAll - should return all payments", async () => {
    const ctx = createMockContext();
    await controller.getAll(ctx as unknown as RouterContext<"/payments">);
    
    assertEquals(ctx.response.status, 0);
    assertEquals(ctx.response.body, [mockPayment]);
  });

  await t.step("getOne - should return one payment", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    
    await controller.getOne(ctx as unknown as RouterContext<"/payments/:id">);
    
    assertEquals(ctx.response.status, 0);
    assertEquals(ctx.response.body, mockPayment);
  });

  await t.step("getOne - should return 404 for non-existent payment", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "999" };
    paymentRepositoryObj.find = async () => null;
    
    await controller.getOne(ctx as unknown as RouterContext<"/payments/:id">);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "Payment not found" });
  });

  await t.step("getOne - sollte 400 bei fehlender ID zurückgeben", async () => {
    const ctx = createMockContext();
    await controller.getOne(ctx as unknown as RouterContext<"/payments/:id">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Id parameter is required" });
  });

  await t.step("create - should create payment successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      amount: 100,
      tax: 19
    });
    
    await controller.create(ctx as unknown as RouterContext<"/payments">);
    
    assertEquals(ctx.response.status, 201);
    assertEquals(ctx.response.body, mockPayment);
  });

  await t.step("create - sollte 400 bei fehlendem Request Body zurückgeben", async () => {
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, 'body', {
      value: undefined,
      writable: true
    });
    
    await controller.create(ctx as RouterContext<"/payments">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Request body is required" });
  });

  await t.step("createPayPalOrder - should create order successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      seats: [1],
      showId: 1
    });
    
    await controller.createPayPalOrder(ctx as unknown as RouterContext<"/payments/create-order">);
    
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, mockPayPalOrder);
  });

  await t.step("createPayPalOrder - sollte 400 bei PayPal-Fehler zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      seats: [1],
      showId: 1
    });
    
    // Mock für PayPal-Fehler
    payPalServiceObj.createOrder = async () => {
      throw new Error("PayPal order creation failed");
    };
    
    await controller.createPayPalOrder(ctx as RouterContext<"/payments/create-order">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "PayPal order creation failed" });
  });

  await t.step("capturePayPalOrder - sollte 400 bei fehlender Order ID zurückgeben", async () => {
    const ctx = createMockContext();
    await controller.capturePayPalOrder(ctx as unknown as RouterContext<"/payments/capture/:orderId">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Order ID is required" });
  });

  await t.step("capturePayPalOrder - sollte 400 bei PayPal-Fehler zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = { orderId: "123" };
    
    // Mock für PayPal-Fehler
    payPalServiceObj.captureOrder = async () => {
      throw new Error("PayPal capture failed");
    };
    
    await controller.capturePayPalOrder(ctx as unknown as RouterContext<"/payments/capture/:orderId">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "PayPal capture failed" });
  });

  await t.step("finalizeBooking - sollte PayPal-Zahlung erfolgreich abschließen", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      orderId: "123",
      seats: [1],
      showId: 1,
      userId: "user1"
    });

    // Mock für erfolgreiche PayPal-Erfassung
    payPalServiceObj.captureOrder = async () => ({
      purchase_units: [{
        payments: {
          captures: [{
            amount: { value: "10.00" }
          }]
        }
      }]
    });

    await controller.finalizeBooking(ctx as unknown as RouterContext<"/payments/finalize">);
    assertEquals(ctx.response.status, 201);
    assertEquals((ctx.response.body as {payment_id: number}).payment_id, 1);
    assertEquals((ctx.response.body as {bookings: any[]}).bookings.length, 1);
  });

  await t.step("finalizeBooking - sollte Zahlungsdatensatz erstellen", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      orderId: "123",
      seats: [1],
      showId: 1,
      userId: "user1"
    });

    // Mock für Zahlungserstellung
    paymentRepositoryObj.create = async (data) => ({
      id: 1,
      ...data,
      payment_time: new Date(),
      time_of_payment: new Date()
    });

    await controller.finalizeBooking(ctx as unknown as RouterContext<"/payments/finalize">);
    assertEquals(ctx.response.status, 201);
    assertEquals((ctx.response.body as {payment_id: number}).payment_id, 1);
  });

  await t.step("finalizeBooking - sollte Buchungsdatensätze erstellen", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      orderId: "123",
      seats: [1, 2],
      showId: 1,
      userId: "user1"
    });

    // Mock für Buchungserstellung
    bookingRepositoryObj.create = async (data) => ({
      id: Math.random(),
      ...data,
      booking_time: new Date()
    });

    await controller.finalizeBooking(ctx as unknown as RouterContext<"/payments/finalize">);
    assertEquals(ctx.response.status, 201);
    assertEquals((ctx.response.body as {bookings: any[]}).bookings.length, 2);
    assertEquals(typeof (ctx.response.body as {bookings: any[]}).bookings[0].token, "string");
  });

  await t.step("update - sollte 400 bei nicht existierender Zahlung zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "999" };
    ctx.request.body.json = async () => ({
      payment_status: "refunded"
    });

    // Mock für nicht gefundene Zahlung
    paymentRepositoryObj.find = async () => null;

    await controller.update(ctx as unknown as RouterContext<"/payments/:id">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Invalid JSON" });
  });

});
