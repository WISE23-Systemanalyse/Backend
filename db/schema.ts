import * as usersSchema from "./models/users.ts";
import * as moviesSchema from "./models/movies.ts";
import * as hallsSchema from "./models/halls.ts";
import * as seatsSchema from "./models/seats.ts";
import * as showsSchema from "./models/shows.ts";
import * as bookingsSchema from "./models/bookings.ts";
import * as paymentsSchema from "./models/payments.ts";
import * as reservationsSchema from "./models/reservations.ts";
import * as VerificationCodeSchema from "./models/verificationCodes.ts";
import * as categorySchema from "./models/categories.ts";
import * as friendshipsSchema from "./models/friendships.ts";

export const schema = {
  ...usersSchema,
  ...moviesSchema,
  ...hallsSchema,
  ...seatsSchema,
  ...showsSchema,
  ...bookingsSchema,
  ...paymentsSchema,
  ...categorySchema,
  ...reservationsSchema,
  ...VerificationCodeSchema,
  ...friendshipsSchema
};
