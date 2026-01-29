import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CategoryStat, StatType } from '@domain/finance/interfaces/category-stat.interface';

@Component({
  selector: 'app-stat-card',
  imports: [DecimalPipe, NgClass],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {

  readonly stat = input.required<CategoryStat>();

  readonly colorClasses: Record<StatType, { bg: string; text: string }> = {
    error: { bg: 'bg-error/10', text: 'text-error' },
    warning: { bg: 'bg-warning/10', text: 'text-warning' },
    success: { bg: 'bg-success/10', text: 'text-success' },
    info: { bg: 'bg-info/10', text: 'text-info' },
  };

}
