import {TestBed} from '@angular/core/testing';

import {ChartPointsExcerptService} from './chart-points-excerpt.service';

describe('ChartPointsExcerptService', () => {
  let service: ChartPointsExcerptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartPointsExcerptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
