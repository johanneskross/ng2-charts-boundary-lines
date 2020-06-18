import {TestBed} from '@angular/core/testing';
import {ChartDataSets, ChartPoint} from 'chart.js';
import {ChartPointsFittingService} from './chart-points-fitting.service';
import BoundaryChartDataSets from './boundary-chart-datasets.model';

describe('ChartPointsFittingService', () => {
  describe('When a charted dataset has different time intervals than an original dataset', doInterpolateData);
  describe('When a charted dataset contains same time intervals as an original dataset', doNotInterpolateData);
});

function createTestData(initialValue: number, termination: number, step: number): ChartPoint[] {
  const chartPoints: ChartPoint[] = [];
  for (let i = initialValue; i < termination; i = i + step) {
    chartPoints.push({x: new Date(2020, 1, 1, 1, 1, i), y: 0})
  }
  return chartPoints;
}

function doInterpolateData() {
  let service: ChartPointsFittingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartPointsFittingService);
  });

  it('Then the original dataset should be fitted accordingly', () => {
    const dataIndex = 0;
    const pointIndex = 1;

    // y points [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    const outputData: ChartDataSets[] = [{data: createTestData(0,30, 1)}];

    // charted data, which has a different time interval and one point is changed such as by dragging a data point
    // y points [0,10,0]
    const chartData: BoundaryChartDataSets[] = [{data: createTestData(0, 30, 10)}];
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
}

function doNotInterpolateData() {

  let service: ChartPointsFittingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartPointsFittingService);
  });

  it('Then the original dataset should be fitted without the need of any interpolation', () => {
    const dataIndex = 0;
    const pointIndex = 1;

    // output data to be adapted
    // y points [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    const outputData: ChartDataSets[] = [{data: createTestData(0, 30, 1)}];

    // charted data, which has a different time interval and one point is changed such as by dragging a data point
    // y points [0,10,0]
    const chartData: BoundaryChartDataSets[] = [{data: createTestData(9, 13, 1)}];
    (chartData[dataIndex].data[pointIndex] as ChartPoint).y = 10;

    // expected output
    // y points [0,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    const expectedOutputPoints: ChartPoint[] = createTestData(0,30, 1);
    expectedOutputPoints[10].y = 10;

    service.fitOutputData(outputData, chartData, dataIndex, pointIndex);
    expect(expectedOutputPoints).toEqual(outputData[dataIndex].data as ChartPoint[]);
  });
}
