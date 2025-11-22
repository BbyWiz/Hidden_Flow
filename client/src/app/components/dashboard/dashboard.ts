import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { stockInformation } from '../../models/stock-information';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  //  title = 'Stock Screener Dashboard';

  private apiBaseUrl = 'http://localhost:4300/api';
  private ngrokUrl = '';

  symbol = 'AAPL';
  smaWindow = 7;
  rsiPeriod = 7;

  isLoading = false;
  error: string | null = null;
  result: stockInformation | null = null;

  constructor(private http: HttpClient) {}

  runScreen(): void {
    this.error = null;
    this.result = null;
    const trimmed = (this.symbol || '').trim().toUpperCase();
    if (!trimmed) {
      this.error = 'Symbol is required';
      return;
    }

    this.isLoading = true;

    const body = {
      symbol: trimmed,
      smaWindow: this.smaWindow,
      rsiPeriod: this.rsiPeriod,
      //plan to add a history block here to override defaults
    };

    this.http.post<stockInformation>(`${this.apiBaseUrl}/yahoo/screen`, body).subscribe({
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
