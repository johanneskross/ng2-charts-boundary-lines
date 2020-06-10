import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ng2ChartsBoundaryLinesComponent } from './ng2-charts-boundary-lines.component';

describe('Ng2ChartsBoundaryLinesComponent', () => {
  let component: Ng2ChartsBoundaryLinesComponent;
  let fixture: ComponentFixture<Ng2ChartsBoundaryLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ng2ChartsBoundaryLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ng2ChartsBoundaryLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
