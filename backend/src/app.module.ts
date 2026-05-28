import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/transaction.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { FixedExpensesModule } from './fixed-expenses/fixed-expenses.module';
import { FixedExpense } from './fixed-expenses/fixed-expense.entity';
import { CronService } from './cron.service';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '010581',
      database: 'mei_manager',
      entities: [Transaction, User, FixedExpense],
      synchronize: true, // Cria/atualiza as tabelas automaticamente (apenas para desenvolvimento)
    }),
    ScheduleModule.forRoot(),
    TransactionsModule,
    UsersModule,
    AuthModule,
    FixedExpensesModule,
  ],
  controllers: [],
  providers: [CronService],
})
export class AppModule { }
