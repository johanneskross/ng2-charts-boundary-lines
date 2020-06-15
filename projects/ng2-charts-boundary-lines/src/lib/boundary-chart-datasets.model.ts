import {ChartDataSets} from 'chart.js';

export default interface BoundaryChartDataSets extends ChartDataSets {
  dragData: boolean;
  maxDataPoints: number;
  aggregationStrategy: AggregationStrategy;
}

export enum AggregationStrategy {
  MAX,
  MIN
}
