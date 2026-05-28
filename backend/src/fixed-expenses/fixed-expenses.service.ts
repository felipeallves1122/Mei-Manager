import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, LessThanOrEqual } from 'typeorm';
import { FixedExpense } from './fixed-expense.entity';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class FixedExpensesService {
  constructor(
    @InjectRepository(FixedExpense)
    private readonly fixedExpenseRepository: Repository<FixedExpense>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(): Promise<FixedExpense[]> {
    return this.fixedExpenseRepository.find({ order: { dayOfMonth: 'ASC' } });
  }

  async create(createFixedExpenseDto: CreateFixedExpenseDto): Promise<FixedExpense> {
    const fixedExpense = this.fixedExpenseRepository.create(createFixedExpenseDto);
    return this.fixedExpenseRepository.save(fixedExpense);
  }

  async remove(id: string): Promise<void> {
    const result = await this.fixedExpenseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Gasto fixo com ID ${id} não encontrado`);
    }
  }

  async processPendingExpenses(): Promise<void> {
    // Process expenses that are active
    const activeExpenses = await this.fixedExpenseRepository.find({ where: { isActive: true } });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const expense of activeExpenses) {
      let currentCheckDate = expense.lastProcessedDate 
        ? new Date(expense.lastProcessedDate) 
        : new Date(today.getFullYear(), today.getMonth() - 1, expense.dayOfMonth); // Start from last month if never processed

      // Move to the next theoretical billing cycle
      currentCheckDate.setMonth(currentCheckDate.getMonth() + 1);
      
      let processed = false;

      while (currentCheckDate <= today) {
        // We need to generate a transaction for this month
        if (today.getDate() >= expense.dayOfMonth || today.getMonth() > currentCheckDate.getMonth() || today.getFullYear() > currentCheckDate.getFullYear()) {
           
           const txDate = new Date(currentCheckDate.getFullYear(), currentCheckDate.getMonth(), expense.dayOfMonth);
           
           // Only generate if we haven't already for this exact month (double check)
           const newTx = this.transactionRepository.create({
             type: 'gasto_fixo',
             amount: expense.amount,
             description: expense.description,
             date: txDate
           });
           
           await this.transactionRepository.save(newTx);
           
           expense.lastProcessedDate = txDate;
           processed = true;
        }
        currentCheckDate.setMonth(currentCheckDate.getMonth() + 1);
      }

      if (processed) {
        await this.fixedExpenseRepository.save(expense);
      }
    }
  }
}
