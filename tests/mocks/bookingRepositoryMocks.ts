import { Booking } from "../../db/models/bookings.ts";

export const mockBooking: Booking = {
  id: 1,
  user_id: "user123",
  show_id: 1,
  seat_id: 1,
  booking_time: new Date(),
  payment_id: 1,
  token: "token123",
  email: "test@test.com"
};

export const mockBookingWithDetails = {
  booking_id: 1,
  user_id: "user123",
  show_id: 1,
  seat_id: 1,
  payment_id: 1,
  booking_time: new Date(),
  email: "test@test.com",
  first_name: "Test",
  last_name: "User",
  user_name: "testuser",
  image_url: "image.jpg",
  movie_id: 1,
  hall_id: 1,
  start_time: new Date(),
  base_price: 10.0,
  row_number: 1,
  seat_number: 1,
  category_id: 1,
  amount: 10.0,
  payment_time: new Date(),
  tax: 1.0,
  payment_method: "card",
  payment_status: "completed",
  time_of_payment: new Date()
}; 