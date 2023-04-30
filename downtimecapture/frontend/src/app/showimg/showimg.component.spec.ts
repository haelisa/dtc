import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowimgComponent } from './showimg.component';

describe('ShowimgComponent', () => {
  let component: ShowimgComponent;
  let fixture: ComponentFixture<ShowimgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowimgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowimgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
