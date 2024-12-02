// FILE: services/userService.ts
import {findUserById} from "../db/db.ts";
import "https://deno.land/x/dotenv/load.ts";


const userService = {
  getUserById: async (id: number) => {
    return (await findUserById(String(id)))[0];
  },
};

export { userService };
