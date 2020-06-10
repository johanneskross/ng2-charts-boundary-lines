import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {ChartDataSets, ChartOptions, ChartPoint} from 'chart.js';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as dragDataAnnotations from 'chartjs-plugin-dragdata';
import * as zoomAnnotations from 'chartjs-plugin-zoom';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng2-charts-boundary-lines',
  templateUrl: './ng2-charts-boundary-lines.component.html',
  styles: []
})
export class Ng2ChartsBoundaryLinesComponent implements OnInit {

  @Input() width: number;
  @Input() height: number;
  @Input() maxDataPoints = 48;
  @Input() systemTraces: ChartPoint[];
  @Input() lowerBaseline: ChartPoint[];
  @Input() upperBaseline: ChartPoint[];
  @Output() lowerBaselineChange = new EventEmitter();
  @Output() upperBaselineChange = new EventEmitter();
  public lineChartData: (ChartDataSets & { dragData })[];
  public lineChartOptions: (ChartOptions & { dragData, dragDataRound, dragOptions, onDragStart, onDrag, onDragEnd });
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations, dragDataAnnotations, zoomAnnotations];

  @ViewChild(BaseChartDirective, {static: true}) chart: BaseChartDirective;

  constructor() {
  }

  ngOnInit(): void {
    this.lineChartData = [
      {
        data: this.systemTraces, fill: 'none', borderColor: 'rgba(77,83,96,1)', backgroundColor: 'rgba(77,83,96,0.2)', label: 'Trace',
        dragData: false
      },
      {
        data: this.lowerBaseline, fill: 'start', borderColor: 'red', backgroundColor: 'rgba(255,0,0,0.3)', label: 'Lower Baseline',
        dragData: true
      },
      {
        data: this.upperBaseline, fill: 'end', borderColor: 'red', backgroundColor: 'rgba(255,0,0,0.3)', label: 'Upper Baseline',
        dragData: true
      }
    ];
    this.lineChartOptions = this.setLineChartOptions(this.upperBaseline);
    this.updateData();
  }

  private updateData(from: Date = this.upperBaseline[0].x as Date, to: Date = this.upperBaseline[this.upperBaseline.length - 1].x as Date) {
    this.lineChartData[0].data = this.filterChartPoints(this.systemTraces, from, to);
    this.lineChartData[1].data = this.filterChartPoints(this.lowerBaseline, from, to, AggregationStrategy.MAX);
    this.lineChartData[2].data = this.filterChartPoints(this.upperBaseline, from, to, AggregationStrategy.MIN);
  }

  private filterChartPoints(chartPoints: ChartPoint[], from: Date, to: Date, strategy: AggregationStrategy = null): ChartPoint[] {
    const chartPointsByTimeRange = this.getChartPointsByTimeRange(chartPoints, from, to);
    return this.filterChartPointsByMaxDataPoints(chartPointsByTimeRange, strategy);
  }

  private getChartPointsByTimeRange(chartPoints: ChartPoint[], from: Date, to: Date): ChartPoint[] {
    const timespan = to.getTime() - from.getTime();
    const marginTime = 2 * (timespan / this.maxDataPoints);
    const fromWithMarginTime = new Date(from.getTime() - marginTime);
    const toWithMarginTime = new Date(to.getTime() + marginTime);
    return chartPoints.filter((value) => ((value.x as Date) >= fromWithMarginTime && (value.x as Date) <= toWithMarginTime));
  }

  private filterChartPointsByMaxDataPoints(chartPoints: ChartPoint[], strategy: AggregationStrategy = null): ChartPoint[] {
    const from = (chartPoints[0].x as Date).getTime();
    const to = (chartPoints[chartPoints.length - 1].x as Date).getTime();
    const timespan = to - from;
    const timespanPerDataPoint = timespan / this.maxDataPoints;

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

  private setLineChartOptions(points: Chart.ChartPoint[]):
    (ChartOptions & { dragData, dragDataRound, dragOptions, onDragStart, onDrag, onDragEnd }) {

    const rangeMin = points.length > 0 ? points[0].x : null;
    const rangeMax = points.length > 0 ? points[points.length - 1].x : null;

    return {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 5
        }
      },
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              displayFormats: {
                hour: 'HH:mm',
                minute: 'HH:mm',
                second: 'HH:mm:ss'
              }
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Date'
            },
            ticks: {
              min: rangeMin,
              max: rangeMax,
              major: {
                enabled: true
              },
              minor: {
                autoSkip: true
              },
              sampleSize: 8
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'value'
            },
            ticks: {
              beginAtZero: true
            }
          }
        ]
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
            speed: 0.5,
            rangeMin: {
              x: rangeMin,
            },
            rangeMax: {
              x: rangeMax,
            },
          },
          zoom: {
            enabled: true,
            drag: false,
            mode: 'x',
            speed: 0.05,
            threshold: 2,
            rangeMin: {
              x: rangeMin,
            },
            rangeMax: {
              x: rangeMax,
            },
            onZoomComplete: ({chart}) => {
              const chartOptions = chart.options.scales.xAxes[0];
              const startX = chartOptions.ticks.min as number;
              const endX = chartOptions.ticks.max as number;
              this.updateData(new Date(startX), new Date(endX));
            }
          }
        }
      },
      dragData: true,
      dragDataRound: 1,
      dragOptions: {
        showTooltip: true
      },
      onDragStart: (e) => {
        // do nothing
      },
      onDrag: (e) => {
        e.target.style.cursor = 'grabbing';
      },
      onDragEnd: (e, datasetIndex, index, value) => {
        console.log(value);
        const point: ChartPoint[] = this.lineChartData[datasetIndex].data as ChartPoint[];
        console.log(point[index]);
        e.target.style.cursor = 'default';
        this.emitBaselineChange();
      }
    };
  }

  private emitBaselineChange() {
    this.lowerBaselineChange.emit(this.lowerBaseline);
    this.upperBaselineChange.emit(this.upperBaseline);
  }

}

export enum AggregationStrategy {
  MAX,
  MIN
}
