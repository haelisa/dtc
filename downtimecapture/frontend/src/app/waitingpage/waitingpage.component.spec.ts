import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingpageComponent } from './waitingpage.component';

describe('WaitingpageComponent', () => {
  let component: WaitingpageComponent;
  let fixture: ComponentFixture<WaitingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
