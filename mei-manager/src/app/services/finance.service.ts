import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export type TransactionType = 'venda_vista' | 'venda_prazo' | 'compra_vista' | 'compra_prazo' | 'gasto_fixo';

export interface FixedExpense {
  id: string;
  description: string;
  amount: number;
  dayOfMonth: number;
  isActive: boolean;
  lastProcessedDate?: Date;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/transactions';
  private fixedApiUrl = 'http://localhost:3000/fixed-expenses';

  // Using Angular Signals for state management
  transactions = signal<Transaction[]>([]);
  fixedExpenses = signal<FixedExpense[]>([]);

  // Computed signals for our metrics
  apurado = computed(() => {
    return this.transactions()
      .filter(t => t.type === 'venda_vista' || t.type === 'venda_prazo')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  dividas = computed(() => {
    return this.transactions()
      .filter(t => t.type === 'compra_prazo')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  lucro = computed(() => {
    const receitas = this.apurado();
    const despesas = this.transactions()
      .filter(t => t.type === 'compra_vista' || t.type === 'compra_prazo' || t.type === 'gasto_fixo')
      .reduce((sum, t) => sum + t.amount, 0);
    return receitas - despesas;
  });

  monthlyReports = computed(() => {
    const reportsMap = new Map<string, { entradas: number, saidas: number, lucro: number }>();

    this.transactions().forEach(t => {
      const date = new Date(t.date);
      const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
      const monthYear = `${monthStr}/${date.getFullYear()}`;
      
      if (!reportsMap.has(monthYear)) {
        reportsMap.set(monthYear, { entradas: 0, saidas: 0, lucro: 0 });
      }
      
      const report = reportsMap.get(monthYear)!;
      
      if (t.type === 'venda_vista' || t.type === 'venda_prazo') {
        report.entradas += t.amount;
        report.lucro += t.amount;
      } else if (t.type === 'compra_vista' || t.type === 'compra_prazo' || t.type === 'gasto_fixo') {
        report.saidas += t.amount;
        report.lucro -= t.amount;
      }
    });

    return Array.from(reportsMap.entries()).map(([month, data]) => ({
      month,
      ...data
    })).sort((a, b) => {
      const [mA, yA] = a.month.split('/').map(Number);
      const [mB, yB] = b.month.split('/').map(Number);
      return yB - yA || mB - mA;
    });
  });

  loadTransactions() {
    this.http.get<Transaction[]>(this.apiUrl).subscribe({
      next: (txs) => {
        const parsed = txs.map(t => ({
          ...t,
          date: new Date(t.date)
        }));
        this.transactions.set(parsed);
      },
      error: (err) => console.error('Erro ao carregar transações', err)
    });
  }

  addTransaction(transaction: Omit<Transaction, 'id'>) {
    return this.http.post<Transaction>(this.apiUrl, transaction).pipe(
      tap(newTx => {
        const parsedTx = { ...newTx, date: new Date(newTx.date) };
        this.transactions.update(txs => [parsedTx, ...txs]);
      })
    );
  }

  deleteTransaction(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.transactions.update(txs => txs.filter(t => t.id !== id));
      })
    );
  }

  loadFixedExpenses() {
    this.http.get<FixedExpense[]>(this.fixedApiUrl).subscribe({
      next: (expenses) => {
        this.fixedExpenses.set(expenses);
      },
      error: (err) => console.error('Erro ao carregar gastos fixos', err)
    });
  }

  addFixedExpense(expense: Omit<FixedExpense, 'id' | 'isActive' | 'lastProcessedDate'>) {
    return this.http.post<FixedExpense>(this.fixedApiUrl, expense).pipe(
      tap(newExp => {
        this.fixedExpenses.update(exps => [...exps, newExp]);
      })
    );
  }

  deleteFixedExpense(id: string) {
    return this.http.delete(`${this.fixedApiUrl}/${id}`).pipe(
      tap(() => {
        this.fixedExpenses.update(exps => exps.filter(e => e.id !== id));
      })
    );
  }
}
