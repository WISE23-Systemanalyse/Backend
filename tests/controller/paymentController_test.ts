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

});
