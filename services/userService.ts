// FILE: services/userService.ts
import { User } from "https://esm.sh/v135/@clerk/backend@1.21.0/dist/index.js";
import {findUserById, createUser, getAllUsers} from "../db/db.ts";
import "https://deno.land/x/dotenv/load.ts";


const userService = {
  getUserById: async (id: string) => {
    return (await findUserById(String(id)))[0];
  },

  createUser: async (user: User) => {
    console.log(user);
    return await createUser(user);
  },

  getAllUsers: async () => {
    return await getAllUsers();
  },
};

export { userService };

