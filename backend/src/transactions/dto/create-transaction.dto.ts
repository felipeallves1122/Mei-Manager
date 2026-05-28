export class CreateTransactionDto {
  type: string;
  amount: number;
  description: string;
  date: string | Date;
}
