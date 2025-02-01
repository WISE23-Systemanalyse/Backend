import { ReservationRepositoryObj } from "../db/repositories/reservations.ts";
import { ReservationNotFound  } from "../Errors/index.ts";


export class ReservationService {
  async create(value: any) {
    try {
      return await ReservationRepositoryObj.create(value)
    } catch (e: unknown) {
      throw e;
    }
  }

  async getReservationById(id: number) {
    const reservation = await ReservationRepositoryObj.find(id);
    if (!reservation) {
      throw new ReservationNotFound();
    }
    return reservation;
  }

  async getAllReservations() {
    return await ReservationRepositoryObj.findAll();
  }

  async getReservationsByShowId(showId: number) {
    return await ReservationRepositoryObj.findByShowId(showId);
  }
    
}


export const reservationServiceObj = new ReservationService();