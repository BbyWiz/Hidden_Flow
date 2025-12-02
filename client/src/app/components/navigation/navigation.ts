import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule, DatePickerModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  today = new Date();

  currentTheme: 'light' | 'dark' = 'light';

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      this.currentTheme = saved;
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
  }

  private applyTheme(): void {
    document.body.classList.toggle('theme-dark', this.currentTheme === 'dark');
  }
}
