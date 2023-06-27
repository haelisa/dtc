import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanceldtmComponent } from './canceldtm.component';

describe('CanceldtmComponent', () => {
  let component: CanceldtmComponent;
  let fixture: ComponentFixture<CanceldtmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanceldtmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanceldtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});