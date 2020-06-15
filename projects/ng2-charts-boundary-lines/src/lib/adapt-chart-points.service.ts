import {Injectable} from '@angular/core';
import {ChartDataSets, ChartPoint} from 'chart.js';
import BoundaryChartDataSets from './boundary-chart-datasets.model';

@Injectable({
  providedIn: 'root'
})
export class AdaptChartPointsService {

  constructor() {
  }

  public adaptChartPoints(chartDataSets: BoundaryChartDataSets[], datasetIndex, datapointIndex, outputDataSets: ChartDataSets[]): void {
    const draggedDataset: ChartPoint[] = chartDataSets[datasetIndex].data as ChartPoint[];
    if ((datapointIndex - 1) >= 0) {
      this.interpolateRawDataset(draggedDataset[datapointIndex - 1], draggedDataset[datapointIndex], datasetIndex, outputDataSets);
    }
    if ((datapointIndex + 1) < draggedDataset.length) {
      this.interpolateRawDataset(draggedDataset[datapointIndex], draggedDataset[datapointIndex + 1], datasetIndex, outputDataSets);
    }
  }

  private interpolateRawDataset(p0: ChartPoint, p1: ChartPoint, datasetIndex: number, outputDataSets: ChartDataSets[]) {
    const dataFromPoToP1 = (outputDataSets[datasetIndex].data as ChartPoint[]).filter(p => p.x >= p0.x && p.x <= p1.x);
    const slope = ((p1.y as number) - (p0.y as number)) / dataFromPoToP1.length;
    dataFromPoToP1.forEach((tmpChartPoint, index) => tmpChartPoint.y = (slope * index) + (p0.y as number));
  }

}
