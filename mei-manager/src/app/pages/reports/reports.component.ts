import { Component, inject, ViewChild, ElementRef, AfterViewInit, EffectRef, effect } from '@angular/core';
import { FinanceService } from '../../services/finance.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: false
})
export class ReportsComponent implements AfterViewInit {
  financeService = inject(FinanceService);
  
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart: Chart | null = null;
  private effectRef: EffectRef;

  constructor() {
    this.effectRef = effect(() => {
      const reports = this.financeService.monthlyReports();
      if (this.chart) {
        this.updateChart(reports);
      }
    });
  }

  ngAfterViewInit() {
    this.initChart(this.financeService.monthlyReports());
  }

  initChart(reports: any[]) {
    if (this.chartCanvas) {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      
      const labels = reports.map(r => r.month).reverse(); 
      const dataEntradas = reports.map(r => r.entradas).reverse();
      const dataSaidas = reports.map(r => r.saidas).reverse();
      const dataLucro = reports.map(r => r.lucro).reverse();

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Lucro/Prejuízo',
              data: dataLucro,
              backgroundColor: dataLucro.map(v => v > 0 ? '#10b981' : (v < 0 ? '#ef4444' : '#6b7280')),
              borderWidth: 1
            },
            {
              label: 'Entradas',
              data: dataEntradas,
              type: 'line',
              borderColor: '#3b82f6',
              tension: 0.1,
              hidden: true
            },
            {
              label: 'Saídas/Custos',
              data: dataSaidas,
              type: 'line',
              borderColor: '#f59e0b',
              tension: 0.1,
              hidden: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  updateChart(reports: any[]) {
    if (!this.chart) return;
    
    const labels = reports.map(r => r.month).reverse();
    const dataEntradas = reports.map(r => r.entradas).reverse();
    const dataSaidas = reports.map(r => r.saidas).reverse();
    const dataLucro = reports.map(r => r.lucro).reverse();

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = dataLucro;
    this.chart.data.datasets[0].backgroundColor = dataLucro.map((v: number) => v > 0 ? '#10b981' : (v < 0 ? '#ef4444' : '#6b7280')) as any;
    
    this.chart.data.datasets[1].data = dataEntradas;
    this.chart.data.datasets[2].data = dataSaidas;
    
    this.chart.update();
  }
}
