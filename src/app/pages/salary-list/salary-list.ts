import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { SalaryState } from '@state/finance/salary.state';
import { Location } from '@angular/common';

@Component({
  selector: 'app-salary-list',
  imports: [DatePipe, DecimalPipe, RouterLink],
  templateUrl: './salary-list.html',
  styleUrl: './salary-list.css'
})
export default class SalaryList {

  private router = inject(Router);
  private location = inject(Location);
  salaryState = inject(SalaryState);

  selectSalary(id: string) {
    this.salaryState.select(id);
    this.router.navigate(['/finance-space/movements']);
  }

  goBack() {
    this.location.back();
  }

}
