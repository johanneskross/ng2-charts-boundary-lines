import {Injectable} from '@angular/core';
import {ChartDataSets, ChartPoint} from 'chart.js';
import BoundaryChartDataSets, {AggregationStrategy} from './boundary-chart-datasets.model';

@Injectable({
  providedIn: 'root'
})
export class FilterChartPointsService {

  constructor() {
  }

  public filterDataSets(chartDataSets: BoundaryChartDataSets[], from: Date, to: Date, outputDataSets: ChartDataSets[]) {
    chartDataSets.forEach((dataset: BoundaryChartDataSets, i: number) => {
      dataset.data = this.filterChartPoints(outputDataSets[i].data as ChartPoint[], from, to, dataset.maxDataPoints, dataset.aggregationStrategy);
    });
  }

  private filterChartPoints(chartPoints: ChartPoint[], from: Date, to: Date, maxDataPoints: number, strategy: AggregationStrategy = null): ChartPoint[] {
    const chartPointsByTimeRange = this.getChartPointsByTimeRange(chartPoints, from, to, maxDataPoints);
    return this.filterChartPointsByMaxDataPoints(chartPointsByTimeRange, maxDataPoints, strategy);
  }

  private getChartPointsByTimeRange(chartPoints: ChartPoint[], from: Date, to: Date, maxDataPoints: number): ChartPoint[] {
    const timespan = to.getTime() - from.getTime();
    const marginTime = 2 * (timespan / maxDataPoints);
    const fromWithMarginTime = new Date(from.getTime() - marginTime);
    const toWithMarginTime = new Date(to.getTime() + marginTime);
    return chartPoints.filter((value) => ((value.x as Date) >= fromWithMarginTime && (value.x as Date) <= toWithMarginTime));
  }

  private filterChartPointsByMaxDataPoints(chartPoints: ChartPoint[], maxDataPoints: number, strategy: AggregationStrategy = null): ChartPoint[] {
    const from = (chartPoints[0].x as Date).getTime();
    const to = (chartPoints[chartPoints.length - 1].x as Date).getTime();
    const timespan = to - from;
    const timespanPerDataPoint = timespan / maxDataPoints;

    const chartPointIndicesOfEachTimespan: number[] = this.getChartPointIndicesOfEachTimespan(chartPoints, timespanPerDataPoint);

    const filteredChartPointsByMaxDataPoints: ChartPoint[] = [];
    let currentValue = 0;
    let currentIndex = 0;
    chartPoints.forEach((chartPoint: ChartPoint, index: number) => {
      if (chartPointIndicesOfEachTimespan.includes(index)) {
        currentValue = chartPoint.y as number;
        filteredChartPointsByMaxDataPoints.push(chartPoint);
        currentIndex = filteredChartPointsByMaxDataPoints.length - 1;
      } else {
        currentValue = this.getAggregatedValue(currentValue, (chartPoint.y as number), strategy);
        filteredChartPointsByMaxDataPoints[currentIndex].y = currentValue;
      }
    });
    return filteredChartPointsByMaxDataPoints;
  }

  private getChartPointIndicesOfEachTimespan(chartPoints: ChartPoint[], timespan: number): number[] {
    const chartPointIndicesOfEachTimespan = [];
    let timeForNextDataPoint = (chartPoints[0].x as Date).getTime();
    chartPoints.forEach((value, index) => {
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
