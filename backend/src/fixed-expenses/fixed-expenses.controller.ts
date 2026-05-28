import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FixedExpensesService } from './fixed-expenses.service';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';

@Controller('fixed-expenses')
export class FixedExpensesController {
  constructor(private readonly fixedExpensesService: FixedExpensesService) {}

  @Post()
  create(@Body() createFixedExpenseDto: CreateFixedExpenseDto) {
    return this.fixedExpensesService.create(createFixedExpenseDto);
  }

  @Get()
  findAll() {
    return this.fixedExpensesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fixedExpensesService.remove(id);
  }
}
