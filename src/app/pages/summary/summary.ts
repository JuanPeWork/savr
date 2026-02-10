import { Component, inject } from '@angular/core';
import { FinanceState } from '../../state/finance/finance.state';
import { SalaryState } from '../../state/finance/salary.state';
import { StatCard } from "./components/stat-card/stat-card";
import { AmountPipe } from '../../shared/pipes/amount.pipe';
import { PrivacyState } from '../../state/ui/privacy.state';

@Component({
  selector: 'app-summary',
  imports: [StatCard, AmountPipe],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export default class Summary {
  financeState = inject(FinanceState);
  privacyState = inject(PrivacyState);

  readonly balance = this.financeState.balance();
  readonly fixedExpenses = this.financeState.fixedExpenses();
  readonly variableExpenses = this.financeState.variableExpenses();
  readonly savingExpenses = this.financeState.savingExpenses();
  readonly leisureExpenses = this.financeState.leisureExpenses();
}
