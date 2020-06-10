import { TestBed } from '@angular/core/testing';

import { Ng2ChartsBoundaryLinesService } from './ng2-charts-boundary-lines.service';

describe('Ng2ChartsBoundaryLinesService', () => {
  let service: Ng2ChartsBoundaryLinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ng2ChartsBoundaryLinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
