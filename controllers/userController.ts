import { Context } from "https://deno.land/x/oak/mod.ts";
import { userService } from "../services/userService.ts";

const userController = {
  // Status Route: Gibt den Status der App zurück
  getUser: async (ctx: Context) => {
    const { id }= ctx.params;
    if (id && !isNaN(Number(id)) ) {
      const parsedId = parseInt(id, 10);
      const user = await userService.getUserById(parsedId);
      if (user) {
        ctx.response.status = 200;
        ctx.response.body = user;
      } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "User not found" };
      }
    } else {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid user ID" };
    }
  },
  createUser: async (ctx: Context, ) => {
    try {
      // Retrieve and parse the request body
      const body = await ctx.request.body;
    
      
      // Ensure the request body is JSON
      if (body.type() !== "json") {
        ctx.response.status = 400;
        ctx.response.body = { message: "Invalid content type" };
        return;
      }
  
      const value = await body.text(); // Parse the JSON body
      const { id, name, email } = JSON.parse(value);
      
      // Validate the extracted data
      if (!id || !name || !email) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Invalid user data" };
        return;
      }
  
      // Call the user service to create the user
      await userService.createUser(id, name, email);
  
      // Respond with success
      ctx.response.status = 201;
      ctx.response.body = { message: "User created successfully" };
    } catch (error) {
      console.error("Error creating user:", error);
      ctx.response.status = 500;
      ctx.response.body = { message: "Internal Server Error" };
    }
  }
};

export { userController };
