import { Component, inject } from '@angular/core';
import { FinanceService } from '../../services/finance.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent {
  financeService = inject(FinanceService);
}
