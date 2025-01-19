import { ReservationRepositoryObj } from "../db/repositories/reservations.ts";
import {Create} from "../interfaces/repository.ts"
import { Reservation } from "../db/models/reservations.ts";
import { InternalServerError, ReservationNotFound, ApiError  } from "../Errors/index.ts";


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
    
}


export const reservationServiceObj = new ReservationService();