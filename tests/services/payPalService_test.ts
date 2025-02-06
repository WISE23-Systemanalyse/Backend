import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { payPalService, PayPalOrderItem } from "../../services/payPalService.ts";

// Mock für fetch
const mockFetch = async (url: string, options: RequestInit) => {
  if (url.endsWith('/v1/oauth2/token')) {
    return {
      json: async () => ({
        access_token: "mock_access_token",
        expires_in: 3600
      })
    };
  }
  
  if (url.endsWith('/v2/checkout/orders')) {
    return {
      json: async () => ({
        id: "mock_order_id",
        status: "CREATED",
        links: [
          {
            href: "https://api.sandbox.paypal.com/mock-link",
            rel: "self",
            method: "GET"
          }
        ]
      })
    };
  }

  if (url.includes('/capture')) {
    return {
      json: async () => ({
        id: "mock_order_id",
        status: "COMPLETED"
      })
    };
  }

  throw new Error(`Unerwarteter URL-Aufruf: ${url}`);
};

Deno.test("PayPalService Tests", async (t) => {
  let service: payPalService;

  await t.step("setup", () => {
    service = new payPalService();
    // @ts-ignore - Mock fetch
    globalThis.fetch = mockFetch;
  });

  await t.step("sollte eine Bestellung erstellen", async () => {
    const items: PayPalOrderItem[] = [{
      name: "Kinokarte",
      quantity: 2,
      price: 12.99
    }];

    const order = await service.createOrder(items);
    
    assertExists(order.id);
    assertEquals(order.status, "CREATED");
    assertExists(order.links);
  });

  await t.step("sollte eine Bestellung erfassen", async () => {
    const captureResult = await service.captureOrder("mock_order_id");
    
    assertEquals(captureResult.id, "mock_order_id");
    assertEquals(captureResult.status, "COMPLETED");
  });

  await t.step("sollte Steuern korrekt berechnen", async () => {
    const items: PayPalOrderItem[] = [{
      name: "Kinokarte",
      quantity: 1,
      price: 100
    }];

    const order = await service.createOrder(items, 0.19);
    assertExists(order);
  });
});
