import { payments, Payment } from "../models/payments.ts";
import { BaseRepository } from "./baseRepository.ts";


export class PaymentRepository extends BaseRepository<Payment>{
    constructor() {
        super(payments);
    }
}

export const paymentRepositoryObj = new PaymentRepository();