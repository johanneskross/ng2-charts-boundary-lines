import {TestBed} from '@angular/core/testing';
import {ChartDataSets, ChartPoint} from 'chart.js';
import {ChartPointsExcerptService} from './chart-points-excerpt.service';
import BoundaryChartDataSets, {AggregationStrategy} from './boundary-chart-datasets.model';

function createTestData(initialValue: number, termination: number, step: number): ChartPoint[] {
  const chartPoints: ChartPoint[] = [];
  for (let i = initialValue; i < termination; i = i + step) {
    chartPoints.push({x: new Date(2020, 1, 1, 1, 1, i), y: i});
  }
  return chartPoints;
}

describe('ChartPointsExcerptService', () => {

  describe('When a chart excerpt is created', () => {

    let service: ChartPointsExcerptService;
    let outputData: ChartDataSets[];
    let chartData: BoundaryChartDataSets[];
    let from: Date;
    let to: Date;
    let maxDataPoints: number;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(ChartPointsExcerptService);

      // y points [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
      outputData = [{data: createTestData(0, 20, 1)}];

      from = new Date(2020, 1, 1, 1, 1, 5);
      to = new Date(2020, 1, 1, 1, 1, 14);
      maxDataPoints = 5;
      chartData = [{
        aggregationStrategy: AggregationStrategy.MAX,
        maxDataPoints,
      }];
      service.excerptChartData(outputData, chartData, from, to, false);
    });

    it('Then the time range should be adapted', () => {
      (chartData[0].data as ChartPoint[]).forEach((value: ChartPoint) => {
        expect(value.x >= from && value.x <= to).toBeTrue();
      });
    });

    it('Then the time interval should be adapted', () => {
      expect((chartData[0].data as ChartPoint[]).length).toBe(maxDataPoints);
    });

    it('Then the values should be aggregated for each interval', () => {
      const yPoints = [];
      (chartData[0].data as ChartPoint[]).forEach(value => yPoints.push(value.y));
      expect(yPoints).toEqual([6, 8, 10, 12, 14]);
    });

    it('Then the original dataset should not be changed', () => {
      expect(outputData[0].data).toEqual(createTestData(0, 20, 1));
    });

  });

});
