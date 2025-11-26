import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Yahoo {
  // private apiBaseUrl = 'http://localhost:4300/api';
  private apiBaseUrl = '/api';

  constructor(private http: HttpClient) {}
 //basic api post for to grab JSON results from the server. 
  screen(symbol: string, smaWindow: number, rsiPeriod: number, summary: string): Observable<any> {
    const trimmed = (symbol || '').trim().toUpperCase();

    const body = {
      symbol: trimmed,
      smaWindow,
      rsiPeriod,
      summary
    };

    return this.http.post<any>(`${this.apiBaseUrl}/yahoo/screen`, body);
  }
}
