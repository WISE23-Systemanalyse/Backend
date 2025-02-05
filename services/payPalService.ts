
export class payPalService {
    private clientId: string;
    private clientSecret: string;
    private baseUrl: string;
    private accessToken: string = "";
    private tokenExpiry: number = 0;
  
    constructor() {
      this.clientId = Deno.env.get("PAYPAL_CLIENT_ID") || "";
      this.clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET") || "";
      this.baseUrl = Deno.env.get("NODE_ENV") === "production"
        ? "https://api.paypal.com"
        : "https://api.sandbox.paypal.com";
    }
  
    private async getAccessToken(): Promise<string> {
      if (this.accessToken && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }
  
      const auth = btoa(`${this.clientId}:${this.clientSecret}`);
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });
  
      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      return this.accessToken;
    }
  
    async createOrder(items: PayPalOrderItem[], taxRate: number = 0.19): Promise<PayPalOrder> {
      const accessToken = await this.getAccessToken();
      
      const totalAmount = items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      const taxAmount = totalAmount * taxRate;
      const finalAmount = totalAmount + taxAmount;
  
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{
            amount: {
              currency_code: "EUR",
              value: finalAmount.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "EUR",
                  value: totalAmount.toFixed(2),
                },
                tax_total: {
                  currency_code: "EUR",
                  value: taxAmount.toFixed(2),
                },
              },
            },
            items: items.map(item => ({
              name: item.name,
              quantity: item.quantity.toString(),
              unit_amount: {
                currency_code: "EUR",
                value: item.price.toFixed(2),
              },
            })),
          }],
        }),
      });
  
      return await response.json();
    }
  
    async captureOrder(orderId: string) {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(
        `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      return await response.json();
    }
  }
  
  export const payPalServiceObj = new payPalService();


  export interface PayPalOrderItem {
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface PayPalOrder {
    id: string;
    status: string;
    links: Array<{
      href: string;
      rel: string;
      method: string;
    }>;
  }