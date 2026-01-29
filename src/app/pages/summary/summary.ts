import { Component, inject } from '@angular/core';
import { FinanceState } from '../../state/finance/finance.state';
import { SalaryState } from '../../state/finance/salary.state';
import { DecimalPipe } from '@angular/common';
import { StatCard } from "./components/stat-card/stat-card";

@Component({
  selector: 'app-summary',
  imports: [DecimalPipe, StatCard],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export default class Summary {
  financeState = inject(FinanceState);
  salaryState = inject(SalaryState);
}
