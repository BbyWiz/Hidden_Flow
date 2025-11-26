import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { stockInformation } from '../../models/stock-information';
import { Yahoo } from '../../services/yahoo';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  symbol = 'AAPL';
  smaWindow = 7;
  rsiPeriod = 7;
  summary = '';

  isLoading = false;
  error: string | null = null;
  result: stockInformation | null = null;

  constructor(private yahoo: Yahoo) {}

  //Validates the stock symbol input and initiates a screening request with the 
  // specified technical analysis parameters (SMA window, RSI period) to retrieve and display stock data.
   
  runScreen(): void {
    this.error = null;
    this.result = null;

    const trimmed = (this.symbol || '').trim().toUpperCase();
    if (!trimmed) {
      this.error = 'Symbol is required';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    this.yahoo.screen(trimmed, this.smaWindow, this.rsiPeriod, this.summary).subscribe({
      next: (data) => {
        this.result = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('screen error', err);
        this.error = err?.error?.error || err?.message || 'Request failed, see console for details';
        this.isLoading = false;
      },
    });
  }
//bootstrap helper classes
  getRuleBadgeClass(flag: boolean | null | undefined): string {
    if (flag === true) {
      return 'badge bg-success';
    }
    if (flag === false) {
      return 'badge bg-secondary';
    }
    return 'badge bg-light text-muted';
  }

  formatDate(value?: string): string {
    if (!value) {
      return '';
    }
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  }
}
