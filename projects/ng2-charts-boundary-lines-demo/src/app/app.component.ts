import {Component} from '@angular/core';
import {ChartPoint} from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng2-charts-boundary-lines-demo';
  traces: ChartPoint[];
  lowerBaseline: ChartPoint[];
  upperBaseline: ChartPoint[];

  constructor() {
    this.traces = this.createFakeChartPointsForOneDay(40);
    this.lowerBaseline = this.createFakeChartPointsForOneDay(30);
    this.upperBaseline = this.createFakeChartPointsForOneDay(90);
  }

  createFakeChartPointsForOneDay(point: number) {
    const chartPoints: ChartPoint[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60 ; minute = minute + 1) {
        for (let seconds = 0; seconds < 60 ; seconds = seconds + 1) {
          chartPoints.push({
            x: new Date(2020, 4, 20, hour, minute, seconds, 100),
            y: (f(((hour * 60 + minute) * 60 + seconds)) + point)
          });
        }
      }
    }
    return chartPoints;
  }

}

export function f(x: number): number {
  return Math.sin(x * 100);
}
