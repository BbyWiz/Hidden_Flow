import { Component } from '@angular/core';
import { Screener } from '../screener/screener';
import { Chart } from 'chart.js';
import { Charts } from '../charts/charts';

@Component({
  selector: 'app-dashboard',
  imports: [Screener, Charts],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
