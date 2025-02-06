import { assertEquals, assertRejects } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { ReservationService } from "../../services/reservationService.ts";
import { ReservationNotFound } from "../../Errors/index.ts";

// Mock das Repository-Objekt direkt
import { ReservationRepositoryObj } from "../../db/repositories/reservations.ts";

const mockReservations = [
  {
    id: 1,
    seat_id: 1,
    show_id: 1,
    user_id: "user1",
    guest_email: null,
    guest_name: null,
    expire_at: new Date(),
    created_at: new Date()
  }
];

// Mock die Methoden des Repository-Objekts
ReservationRepositoryObj.create = async (value: any) => ({ ...value, id: 2 });
ReservationRepositoryObj.find = async (id: number) => mockReservations.find(r => r.id === id) || null;
ReservationRepositoryObj.findAll = async () => mockReservations;
ReservationRepositoryObj.findByShowId = async (showId: number) => mockReservations.filter(r => r.show_id === showId);

Deno.test("ReservationService Tests", async (t) => {
  const service = new ReservationService();

  await t.step("sollte eine neue Reservierung erstellen", async () => {
    const newReservation = {
      seat_id: 2,
      show_id: 1,
      user_id: "user2",
      expire_at: new Date()
    };

    const result = await service.create(newReservation);
    assertEquals(result.id, 2);
    assertEquals(result.seat_id, newReservation.seat_id);
  });

  await t.step("sollte eine Reservierung nach ID finden", async () => {
    const reservation = await service.getReservationById(1);
    assertEquals(reservation.id, 1);
    assertEquals(reservation.user_id, "user1");
  });

  await t.step("sollte ReservationNotFound werfen wenn ID nicht existiert", async () => {
    await assertRejects(
      async () => {
        await service.getReservationById(999);
      },
      ReservationNotFound
    );
  });

  await t.step("sollte alle Reservierungen abrufen", async () => {
    const reservations = await service.getAllReservations();
    assertEquals(reservations.length, mockReservations.length);
    assertEquals(reservations[0].id, mockReservations[0].id);
  });

  await t.step("sollte Reservierungen nach ShowId finden", async () => {
    const reservations = await service.getReservationsByShowId(1);
    assertEquals(reservations.length, 1);
    assertEquals(reservations[0].show_id, 1);
  });
});
