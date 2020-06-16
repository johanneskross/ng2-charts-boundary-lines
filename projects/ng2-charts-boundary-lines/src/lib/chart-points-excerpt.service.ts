import {Injectable} from '@angular/core';
import {ChartDataSets, ChartPoint} from 'chart.js';
import BoundaryChartDataSets, {AggregationStrategy} from './boundary-chart-datasets.model';

@Injectable({
  providedIn: 'root'
})
export class ChartPointsExcerptService {

  constructor() {
  }

  public excerptChartData(outputData: ChartDataSets[], chartData: BoundaryChartDataSets[], from: Date, to: Date) {
    chartData.forEach((dataset: BoundaryChartDataSets, i: number) => {
      dataset.data = this.excerptChartPoints(outputData[i], from, to, dataset);
    });
  }

  private excerptChartPoints(outputData: ChartDataSets, from: Date, to: Date, chartData: BoundaryChartDataSets): ChartPoint[] {
    const chartPointsExcerpt = this.excerptByTimeRange(outputData.data as ChartPoint[], from, to, chartData.maxDataPoints);
    return this.excerptByMaxDataPoints(chartPointsExcerpt, chartData.maxDataPoints, chartData.aggregationStrategy);
  }

  private excerptByTimeRange(chartPoints: ChartPoint[], from: Date, to: Date, maxDataPoints: number): ChartPoint[] {
    const timespan = to.getTime() - from.getTime();
    const margin = 2 * (timespan / maxDataPoints);
    const fromWithMargin = new Date(from.getTime() - margin);
    const toWithMargin = new Date(to.getTime() + margin);
    return chartPoints.filter((value: ChartPoint) => ((value.x as Date) >= fromWithMargin && (value.x as Date) <= toWithMargin));
  }

  private excerptByMaxDataPoints(chartPoints: ChartPoint[], maxDataPoints: number, strategy: AggregationStrategy): ChartPoint[] {
    const from = (chartPoints[0].x as Date).getTime();
    const to = (chartPoints[chartPoints.length - 1].x as Date).getTime();
    const timespan = to - from;
    const timespanPerDataPoint = timespan / maxDataPoints;
    const chartPointIndicesOfEachTimespan: number[] = this.getChartPointIndicesOfEachTimespan(chartPoints, timespanPerDataPoint);
    const excerptByMaxDataPoints: ChartPoint[] = [];
    let currentValue = 0;
    let currentIndex = 0;
    chartPoints.forEach((chartPoint: ChartPoint, index: number) => {
      if (chartPointIndicesOfEachTimespan.includes(index)) {
        currentValue = chartPoint.y as number;
        excerptByMaxDataPoints.push(chartPoint);
        currentIndex = excerptByMaxDataPoints.length - 1;
      } else {
        currentValue = this.getAggregatedValue(currentValue, (chartPoint.y as number), strategy);
        excerptByMaxDataPoints[currentIndex].y = currentValue;
      }
    });
    return excerptByMaxDataPoints;
  }

  private getChartPointIndicesOfEachTimespan(chartPoints: ChartPoint[], timespan: number): number[] {
    const chartPointIndicesOfEachTimespan = [];
    let timeForNextDataPoint = (chartPoints[0].x as Date).getTime();
    chartPoints.forEach((value: ChartPoint, index: number) => {
      const currentTime = (value.x as Date).getTime();
      if (currentTime >= timeForNextDataPoint) {
        timeForNextDataPoint = timeForNextDataPoint + timespan;
        chartPointIndicesOfEachTimespan.push(index);
      }
    });
    return chartPointIndicesOfEachTimespan;
  }

  private getAggregatedValue(last: number, current: number, strategy: AggregationStrategy) {
    switch (strategy) {
      case AggregationStrategy.MAX:
        return last > current ? last : current;
      case AggregationStrategy.MIN:
        return last < current ? last : current;
      default:
        return (last + current) / 2;
    }
  }

}
