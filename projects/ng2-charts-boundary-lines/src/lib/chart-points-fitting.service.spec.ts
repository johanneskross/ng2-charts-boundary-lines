import { TestBed } from '@angular/core/testing';

import { AdaptChartPointsService } from './adapt-chart-points.service';

describe('AdaptChartPointsService', () => {
  let service: AdaptChartPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdaptChartPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
