import * as usersSchema from "./models/users.ts";
import * as moviesSchema from "./models/movies.ts";

export const schema = {
  ...usersSchema,
  ...moviesSchema,
};