import { Component, inject, OnInit } from '@angular/core';
import { FinanceService } from '../../services/finance.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  financeService = inject(FinanceService);

  ngOnInit() {
    this.financeService.loadTransactions();
  }

  get latestReport() {
    const reports = this.financeService.monthlyReports();
    return reports.length > 0 ? reports[0] : null;
  }
}
