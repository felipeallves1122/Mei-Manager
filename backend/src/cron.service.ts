import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FixedExpensesService } from './fixed-expenses/fixed-expenses.service';

@Injectable()
export class CronService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly fixedExpensesService: FixedExpensesService) {}

  async onApplicationBootstrap() {
    this.logger.log('Checando gastos fixos pendentes na inicialização...');
    await this.processFixedExpenses();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyCron() {
    this.logger.log('Executando cron job diário para gastos fixos...');
    await this.processFixedExpenses();
  }

  private async processFixedExpenses() {
    try {
      await this.fixedExpensesService.processPendingExpenses();
      this.logger.log('Gastos fixos processados com sucesso.');
    } catch (error) {
      this.logger.error('Erro ao processar gastos fixos', error.stack);
    }
  }
}
