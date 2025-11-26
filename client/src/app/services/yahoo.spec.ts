import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { Yahoo } from './yahoo';

describe('Yahoo service', () => {
  let service: Yahoo;
  let httpMock: HttpTestingController;
  let summary: string = '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
    });
    service = TestBed.inject(Yahoo);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    // Test to ensure the Yahoo service is instantiated correctly
    expect(service).toBeTruthy();
  });

  it('should POST to /api/yahoo/screen with trimmed and uppercased symbol', () => {
    // Test to verify that the service sends a POST request with the correct symbol format
    const mockResponse = { symbol: 'AAPL' };

    service.screen('  aapl  ', 7, 14, summary).subscribe((resp) => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/yahoo/screen'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      symbol: 'AAPL',
      smaWindow: 7,
      rsiPeriod: 14,
    });

    req.flush(mockResponse);
  });

  it('should allow multiple calls with different symbols', () => {
    // Test to ensure the service can handle multiple requests with different symbols
    const first = service.screen('MSFT', 10, 5, summary).subscribe();
    const second = service.screen('TSLA', 20, 14, summary).subscribe();

    const req1 = httpMock.expectOne((r) => r.url.endsWith('/api/yahoo/screen'));
    expect(req1.request.body.symbol).toBe('MSFT');
    expect(req1.request.body.smaWindow).toBe(10);
    expect(req1.request.body.rsiPeriod).toBe(5);
    req1.flush({ symbol: 'MSFT' });

    const req2 = httpMock.expectOne((r) => r.url.endsWith('/api/yahoo/screen'));
    expect(req2.request.body.symbol).toBe('TSLA');
    expect(req2.request.body.smaWindow).toBe(20);
    expect(req2.request.body.rsiPeriod).toBe(14);
    req2.flush({ symbol: 'TSLA' });

    first.unsubscribe();
    second.unsubscribe();
  });
});
