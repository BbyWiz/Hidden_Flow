import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Dashboard } from './dashboard';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<Dashboard>;
  let component: Dashboard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Dashboard,
        FormsModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error and not start loading if symbol is empty', () => {
    component.symbol = '   ';
    component.isLoading = false;

    component.runScreen();

    expect(component.error).toBe('Symbol is required');
    expect(component.isLoading).toBe(false);
    expect(component.result).toBeNull();
  });

  it('should clear previous error and start loading when symbol is provided', () => {
    component.error = 'Some error';
    component.symbol = 'AAPL';

    component.runScreen();

    expect(component.error).toBeNull();
    expect(component.isLoading).toBe(true);
  });

  it('getRuleBadgeClass should return success class for true', () => {
    const cls = component.getRuleBadgeClass(true);
    expect(cls).toBe('badge bg-success');
  });

  it('getRuleBadgeClass should return secondary class for false', () => {
    const cls = component.getRuleBadgeClass(false);
    expect(cls).toBe('badge bg-secondary');
  });

  it('getRuleBadgeClass should return muted class for null', () => {
    const cls = component.getRuleBadgeClass(null);
    expect(cls).toBe('badge bg-light text-muted');
  });

  it('formatDate should format ISO string to locale date', () => {
    const formatted = component.formatDate('2024-01-02T00:00:00.000Z');
    expect(formatted).not.toBe('');
  });

  it('formatDate should return empty string for undefined', () => {
    const formatted = component.formatDate(undefined);
    expect(formatted).toBe('');
  });
});
