import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CategoryStat, StatType } from '@domain/finance/interfaces/category-stat.interface';
import { AmountPipe } from '../../../../shared/pipes/amount.pipe';
import { PrivacyState } from '../../../../state/ui/privacy.state';

@Component({
  selector: 'app-stat-card',
  imports: [DecimalPipe, NgClass, AmountPipe],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {

  privacyState = inject(PrivacyState);
  readonly stat = input.required<CategoryStat>();

  readonly colorClasses: Record<StatType, { bg: string; text: string }> = {
    error: { bg: 'bg-error/10', text: 'text-error' },
    warning: { bg: 'bg-warning/10', text: 'text-warning' },
    success: { bg: 'bg-success/10', text: 'text-success' },
    info: { bg: 'bg-info/10', text: 'text-info' },
  };

}
