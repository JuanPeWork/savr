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

  readonly balance = this.financeState.balance();
  readonly fixedExpenses = this.financeState.fixedExpenses();
  readonly variableExpenses = this.financeState.variableExpenses();
  readonly savingExpenses = this.financeState.savingExpenses();
  readonly leisureExpenses = this.financeState.leisureExpenses();
}
