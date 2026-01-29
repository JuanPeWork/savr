import { Component } from '@angular/core';
import { Navbar } from "../../shared/components/navbar/navbar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-finance-space',
  imports: [Navbar, RouterOutlet],
  templateUrl: './finance-space.html',
  styleUrl: './finance-space.css'
})
export default class FinanceSpace {

}
