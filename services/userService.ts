// FILE: services/userService.ts
import {findUserById, createUser} from "../db/db.ts";
import "https://deno.land/x/dotenv/load.ts";


const userService = {
  getUserById: async (id: number) => {
    return (await findUserById(String(id)))[0];
  },

  createUser: async (id: number, name: string, email: string) => {
    return await createUser(String(id), name, email);
  }
};

export { userService };
