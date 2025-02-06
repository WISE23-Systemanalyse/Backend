import { halls, Hall } from "../models/halls.ts";
import { BaseRepository } from "./baseRepository.ts";

export class HallRepository extends BaseRepository<Hall> {
    constructor() {
        super(halls);
    }
}

export const hallRepositoryObj = new HallRepository();