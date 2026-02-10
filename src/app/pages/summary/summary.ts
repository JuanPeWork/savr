import { Component, inject, signal } from '@angular/core';
import { FinanceState } from '../../state/finance/finance.state';
import { MovementCategory } from '@domain/finance/interfaces/movements.interface';
import { StatCard } from "./components/stat-card/stat-card";
import { AmountPipe } from '../../shared/pipes/amount.pipe';
import { PrivacyState } from '../../state/ui/privacy.state';
import { DistributionBreakdown } from './components/distribution-breakdown/distribution-breakdown';

@Component({
  selector: 'app-summary',
  imports: [StatCard, AmountPipe, DistributionBreakdown],
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

  readonly selectedCategory = signal<MovementCategory | null>(null);
}
