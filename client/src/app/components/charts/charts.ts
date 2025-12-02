import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface HistoryRow {
  date: string | Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

@Component({
  selector: 'app-charts',
  imports: [CommonModule, FormsModule],
  templateUrl: './charts.html',
  styleUrl: './charts.css',
})
export class Charts implements AfterViewInit {
  symbol = 'AAPL';
  loading = false;
  error: string | null = null;

  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    // Load an initial symbol once the canvas is ready
    this.loadHistory();
  }

  async loadHistory(): Promise<void> {
    this.error = null;

    const s = this.symbol.trim().toUpperCase();
    if (!s) {
      this.error = 'Symbol is required.';
      return;
    }

    this.loading = true;

    try {
      const params = new URLSearchParams({
        symbol: s,
        interval: '1d',
      });

      const res = await fetch(`/api/yahoo/history?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const body = (await res.json()) as { rows: HistoryRow[] };

      const rows = Array.isArray(body.rows) ? body.rows : [];
      const labels = rows.map((r) =>
        new Date(r.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })
      );
      const closes = rows.map((r) => r.close);

      //  compute SMA and EMA from closes
      const period = 20;  
      const sma = this.simpleMovingAverage(closes, period);
      const ema = this.exponentialMovingAverage(closes, period);

      this.updateChart(labels, closes, ema, sma, s, period);
    } catch (err: any) {
      this.error = String(err?.message ?? err);
    } finally {
      this.loading = false;
    }
  }

  //   simple moving average
  private simpleMovingAverage(values: number[], period: number): (number | null)[] {
    const result = new Array<number | null>(values.length).fill(null);
    if (values.length < period) {
      return result;
    }

    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i];
      if (i >= period) {
        sum -= values[i - period];
      }
      if (i >= period - 1) {
        result[i] = sum / period;
      }
    }
    return result;
  }

  // exponential moving average
  private exponentialMovingAverage(values: number[], period: number): (number | null)[] {
    const result = new Array<number | null>(values.length).fill(null);
    if (values.length === 0) {
      return result;
    }

    const k = 2 / (period + 1);
    let emaPrev = values[0];

    for (let i = 0; i < values.length; i++) {
      if (i === 0) {
        emaPrev = values[0];
      } else {
        emaPrev = values[i] * k + emaPrev * (1 - k);
      }
      if (i >= period - 1) {
        result[i] = emaPrev;
      }
    }

    return result;
  }

  private updateChart(
    labels: string[],
    closes: number[],
    ema: (number | null)[],
    sma: (number | null)[],
    symbol: string,
    period: number
  ): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      this.error = 'Unable to get canvas context.';
      return;
    }

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = closes;
      this.chart.data.datasets[0].label = `${symbol} Close`;

      //  overlays
      if (this.chart.data.datasets[1]) {
        this.chart.data.datasets[1].data = ema;
        this.chart.data.datasets[1].label = `EMA ${period}`;
      }
      if (this.chart.data.datasets[2]) {
        this.chart.data.datasets[2].data = sma;
        this.chart.data.datasets[2].label = `SMA ${period}`;
      }

      this.chart.update();
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data: closes,
            label: `${symbol} Close`,
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            data: ema,
            label: `EMA ${period}`,
            borderWidth: 1.5,
            pointRadius: 0,
            borderDash: [4, 2],
          },
          {
            data: sma,
            label: `SMA ${period}`,
            borderWidth: 1.5,
            pointRadius: 0,
            borderDash: [2, 2],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true },
        },
        scales: {
          x: { display: true, title: { display: true, text: 'Date' } },
          y: { display: true, title: { display: true, text: 'Price' } },
        },
      },
    });
  }
}
