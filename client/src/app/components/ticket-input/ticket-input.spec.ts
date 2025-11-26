import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketInput } from './ticket-input';

describe('TicketInput', () => {
  let component: TicketInput;
  let fixture: ComponentFixture<TicketInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
