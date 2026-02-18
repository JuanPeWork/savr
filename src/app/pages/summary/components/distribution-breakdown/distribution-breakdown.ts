import { Component, computed, inject, input, output } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { MovementState } from '@state/finance/movement.state';
import { MovementCategory } from '@domain/finance/models/movement.model';
import { CATEGORY_DISPLAY, StatType } from '@shared/constants/category-display.const';
import { AmountPipe } from '../../../../shared/pipes/amount.pipe';
import { PrivacyState } from '../../../../state/ui/privacy.state';

interface BreakdownItem {
  icon: string;
  concept: string;
  amount: number;
}

const COLOR_CLASSES: Record<StatType, { bg: string; text: string; bar: string }> = {
  error: { bg: 'bg-error/10', text: 'text-error', bar: 'bg-error' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', bar: 'bg-warning' },
  success: { bg: 'bg-success/10', text: 'text-success', bar: 'bg-success' },
  info: { bg: 'bg-info/10', text: 'text-info', bar: 'bg-info' },
};

@Component({
  selector: 'app-distribution-breakdown',
  imports: [DecimalPipe, NgClass, AmountPipe],
  templateUrl: './distribution-breakdown.html',
  styleUrl: './distribution-breakdown.css',
})
export class DistributionBreakdown {

  private movementState = inject(MovementState);
  privacyState = inject(PrivacyState);

  readonly category = input.required<MovementCategory>();
  readonly closed = output<void>();

  readonly config = computed(() => CATEGORY_DISPLAY[this.category()]);

  readonly colorClasses = computed(() => COLOR_CLASSES[this.config().color]);

  readonly breakdownItems = computed<BreakdownItem[]>(() => {
    const cat = this.category();
    const movements = this.movementState.movementsOfActiveSalary();
    const filtered = movements.filter(m => m.category === cat && m.isExpense());

    const grouped = new Map<string, { icon: string; amount: number }>();
    for (const m of filtered) {
      const existing = grouped.get(m.concept);
      if (existing) {
        existing.amount += m.amount;
      } else {
        grouped.set(m.concept, { icon: m.icon, amount: m.amount });
      }
    }

    return Array.from(grouped.entries())
      .map(([concept, { icon, amount }]) => ({ concept, icon, amount }))
      .sort((a, b) => b.amount - a.amount);
  });

  readonly totalAmount = computed(() =>
    this.breakdownItems().reduce((sum, item) => sum + item.amount, 0)
  );

  percentage(amount: number): number {
    const total = this.totalAmount();
    return total > 0 ? (amount / total) * 100 : 0;
  }
}
