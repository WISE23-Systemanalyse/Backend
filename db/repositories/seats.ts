import { seats, Seat } from "../models/seats.ts";
import { eq } from "drizzle-orm";
import { Hall } from "../models/halls.ts";
import { BaseRepository } from "./baseRepository.ts";

export class SeatRepository extends BaseRepository<Seat> {
    constructor() {
        super(seats);
      }
    async findByHallId(hallId: Hall["id"]): Promise<Seat[]> {
        const result = await this.db.select()
            .from(seats)
            .where(eq(seats.hall_id, Number(hallId)))
            .orderBy(seats.row_number, seats.seat_number);
        
        return result;
    }
    
    
}

export const seatRepositoryObj = new SeatRepository();