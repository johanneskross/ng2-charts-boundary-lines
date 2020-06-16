import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {ChartDataSets, ChartOptions, ChartPoint} from 'chart.js';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as dragDataAnnotations from 'chartjs-plugin-dragdata';
import * as zoomAnnotations from 'chartjs-plugin-zoom';
import BoundaryChartDataSets, {AggregationStrategy} from './boundary-chart-datasets.model';
import {ChartPointsExcerptService} from './chart-points-excerpt.service';
import {ChartPointsFittingService} from './chart-points-fitting.service';


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
  @Input() traces: ChartPoint[];
  @Input() lowerBaseline: ChartPoint[];
  @Input() upperBaseline: ChartPoint[];
  @Output() lowerBaselineChange = new EventEmitter();
  @Output() upperBaselineChange = new EventEmitter();
  private outputDataSets: ChartDataSets[];
  public chartDataSets: BoundaryChartDataSets[];
  public chartOptions: (ChartOptions & { dragData, dragDataRound, dragOptions, onDragStart, onDrag, onDragEnd });
  public chartLegend = false;
  public chartType = 'line';
  public chartPlugins = [pluginAnnotations, dragDataAnnotations, zoomAnnotations];
  @ViewChild(BaseChartDirective, {static: true}) chart: BaseChartDirective;

  constructor(private excerptService: ChartPointsExcerptService, private fittingService: ChartPointsFittingService) {
  }

  ngOnInit(): void {
    this.outputDataSets = [{data: this.traces}, {data: this.lowerBaseline}, {data: this.upperBaseline}];
    this.chartDataSets = [
      {
        data: this.traces,
        maxDataPoints: this.maxDataPoints,
        aggregationStrategy: null,
        fill: 'none',
        borderColor: 'rgba(77,83,96,1)',
        backgroundColor: 'rgba(77,83,96,0.2)',
        pointBackgroundColor: 'rgba(77,83,96,0.5)',
        label: 'Trace',
        dragData: false
      },
      {
        data: this.lowerBaseline,
        maxDataPoints: this.maxDataPoints,
        aggregationStrategy: AggregationStrategy.MAX,
        fill: 'start',
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.3)',
        pointBackgroundColor: 'rgba(255,0,0,0.5)',
        label: 'Lower Baseline',
        dragData: true
      },
      {
        data: this.upperBaseline,
        maxDataPoints: this.maxDataPoints,
        aggregationStrategy: AggregationStrategy.MIN,
        fill: 'end',
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.3)',
        pointBackgroundColor: 'rgba(255,0,0, 0.5)',
        label: 'Upper Baseline',
        dragData: true
      }
    ];
    this.chartOptions = this.setLineChartOptions(this.upperBaseline);
    this.filterDataSets(this.upperBaseline[0].x as Date, this.upperBaseline[this.upperBaseline.length - 1].x as Date);
  }

  private filterDataSets(from: Date, to: Date) {
    this.excerptService.excerptChartData(this.outputDataSets, this.chartDataSets, from, to);
  }

  private applyBaselineChange(datasetIndex, datapointIndex) {
    this.fittingService.fitOutputData(this.outputDataSets, this.chartDataSets, datasetIndex, datapointIndex);
    this.lowerBaselineChange.emit(this.lowerBaseline);
    this.upperBaselineChange.emit(this.upperBaseline);
  }

  private setLineChartOptions(points: ChartPoint[]):
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
              suggestedMin: 0
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
              this.filterDataSets(new Date(startX), new Date(endX));
            }
          }
        }
      },
      dragData: true,
      dragDataRound: 1,
      dragOptions: {
        showTooltip: true
      },
      onDragStart: () => {
        // do nothing
      },
      onDrag: (e) => {
        e.target.style.cursor = 'grabbing';
      },
      onDragEnd: (e, datasetIndex, datapointIndex) => {
        this.applyBaselineChange(datasetIndex, datapointIndex);
        e.target.style.cursor = 'default';
      }
    };
  }

}
