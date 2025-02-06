import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { BookingRepository } from "../../../db/repositories/bookings.ts";
import { mockBooking, mockBookingWithDetails } from "../../mocks/bookingRepositoryMocks.ts";

Deno.test("BookingRepository.getBookingsByShowId should return bookings", async () => {
  const mockDb = {
    select: () => mockDb,
    from: () => mockDb,
    where: () => Promise.resolve([mockBooking])
  };

  const repository = new BookingRepository();
  // @ts-ignore - Für Tests überschreiben wir die protected db
  repository.db = mockDb;
  const result = await repository.getBookingsByShowId(1);
  assertEquals(result, [mockBooking]);
});

Deno.test("BookingRepository.getBookingsByUserId should return bookings", async () => {
  const mockDb = {
    select: () => mockDb,
    from: () => mockDb,
    where: () => Promise.resolve([mockBooking])
  };

  const repository = new BookingRepository();
  // @ts-ignore - Für Tests überschreiben wir die protected db
  repository.db = mockDb;
  const result = await repository.getBookingsByUserId("user123");
  assertEquals(result, [mockBooking]);
});

Deno.test("BookingRepository.getBookingsByPaymentId should return bookings", async () => {
  const mockDb = {
    select: () => mockDb,
    from: () => mockDb,
    where: () => Promise.resolve([mockBooking])
  };
  
  const repository = new BookingRepository();
  // @ts-ignore - Für Tests überschreiben wir die protected db
  repository.db = mockDb;
  const result = await repository.getBookingsByPaymentId(1);
  assertEquals(result, [mockBooking]);
});

Deno.test("BookingRepository.getAllBookingDetails should return booking details", async () => {
  const mockDb = {
    select: () => mockDb,
    from: () => mockDb,
    leftJoin: () => mockDb,
    execute: () => Promise.resolve([mockBookingWithDetails])
  };

  const repository = new BookingRepository();
  // @ts-ignore - Für Tests überschreiben wir die protected db
  repository.db = mockDb;
  const result = await repository.getAllBookingDetails();
  assertEquals(result, [mockBookingWithDetails]);
});