import {TestBed} from '@angular/core/testing';
import {ChartDataSets, ChartPoint} from 'chart.js';
import {ChartPointsFittingService} from './chart-points-fitting.service';
import BoundaryChartDataSets from './boundary-chart-datasets.model';

describe('ChartPointsFittingService', () => {
  let service: ChartPointsFittingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartPointsFittingService);
  });

  describe('When an original dataset shall be fitted to the charted data', () => {

    it('Then the original dataset should be adapted accordingly', () => {
      const dataIndex = 0;
      const pointIndex = 1;

      // output data to be adapted
      // y points [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      const outputPoints: ChartPoint[] = [];
      for (let i = 0; i < 30; i++) {
        outputPoints.push({x: new Date(2020, 1, 1, 1, 1, i), y: 0})
      }
      const outputData: ChartDataSets[] = [{data: outputPoints}];

      // charted data, which has a different time interval and one point is changed such as by dragging a data point
      // y points [0,10,0]
      const chartPoints: ChartPoint[] = [];
      for (let i = 0; i < 30; i = i + 10) {
        chartPoints.push({x: new Date(2020, 1, 1, 1, 1, i), y: 0})
      }
      const chartData: BoundaryChartDataSets[] = [{data: chartPoints}];
      (chartData[dataIndex].data[pointIndex] as ChartPoint).y = 10;

      // expected output
      // y points [0,1,2,3,4,5,6,7,8,9,10,9,8,7,6,5,4,3,2,1,0,0,0,0,0,0,0,0,0,0]
      const expectedOutputPoints: ChartPoint[] = [];
      for (let i = 0; i <= 10; i++) {
        expectedOutputPoints.push({x: new Date(2020, 1, 1, 1, 1, i), y: i})
      }
      for (let i = 11; i <= 20; i++) {
        expectedOutputPoints.push({x: new Date(2020, 1, 1, 1, 1, i), y: 20 - i})
      }
      for (let i = 21; i < 30; i++) {
        expectedOutputPoints.push({x: new Date(2020, 1, 1, 1, 1, i), y: 0})
      }

      service.fitOutputData(outputData, chartData, dataIndex, pointIndex);
      expect(expectedOutputPoints).toEqual(outputData[dataIndex].data as ChartPoint[]);
    });
  });
});
