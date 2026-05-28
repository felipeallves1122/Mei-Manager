import { Component, inject } from '@angular/core';
import { FinanceService } from '../../services/finance.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  standalone: false
})
export class TransactionListComponent {
  financeService = inject(FinanceService);

  getIcon(type: string): string {
    switch(type) {
      case 'venda_vista': return '💵';
      case 'venda_prazo': return '📝';
      case 'compra_vista': return '🛒';
      case 'compra_prazo': return '🏷️';
      default: return '📄';
    }
  }

  getLabel(type: string): string {
    switch(type) {
      case 'venda_vista': return 'Venda à Vista';
      case 'venda_prazo': return 'Venda a Prazo';
      case 'compra_vista': return 'Compra à Vista';
      case 'compra_prazo': return 'Compra a Prazo';
      default: return type;
    }
  }

  isIncome(type: string): boolean {
    return type.startsWith('venda');
  }

  onDelete(id: string) {
    this.financeService.deleteTransaction(id).subscribe();
  }
}
