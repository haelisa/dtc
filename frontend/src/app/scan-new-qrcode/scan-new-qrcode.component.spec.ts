import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanNewQRCodeComponent } from './scan-new-qrcode.component';

describe('ScanNewQRCodeComponent', () => {
  let component: ScanNewQRCodeComponent;
  let fixture: ComponentFixture<ScanNewQRCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanNewQRCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanNewQRCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});