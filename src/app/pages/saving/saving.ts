import { Component, computed, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FinanceState } from '../../state/finance/finance.state';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-saving',
  imports: [DatePipe, DecimalPipe, BaseChartDirective],
  templateUrl: './saving.html',
  styleUrl: './saving.css'
})
export default class Saving {

  financeState = inject(FinanceState);
  readonly savingsBySalary = this.financeState.savingsBySalary;
  readonly totalSavings = this.financeState.totalSavings;
  readonly averageSavings = this.financeState.averageSavings;

  readonly chartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const items = this.savingsBySalary();

    return {
      labels: items.map(item => {
        const date = new Date(item.salary.date);
        return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      }),
      datasets: [{
        data: items.map(item => item.saving),
        label: 'Ahorro',
        backgroundColor: '#FDA769b3',
        borderColor: '#FDA769',
        borderWidth: 1,
        borderRadius: 4
      }]
    };
  });

  readonly chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value + ' €'
        }
      }
    }
  };

}
