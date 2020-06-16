import { TestBed } from '@angular/core/testing';

import { FilterChartPointsService } from './filter-chart-points.service';

describe('FilterChartPointsService', () => {
  let service: FilterChartPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterChartPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
