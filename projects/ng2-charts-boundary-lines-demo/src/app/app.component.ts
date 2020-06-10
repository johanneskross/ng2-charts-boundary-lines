import {Component} from '@angular/core';
import {ChartPoint} from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng2-charts-boundary-lines-demo';
  systemTraces: ChartPoint[];
  lowerBaseline: ChartPoint[];
  upperBaseline: ChartPoint[];

  constructor() {
    this.systemTraces = this.createFakeChartPointsForOneDay(40);
    this.lowerBaseline = this.createFakeChartPointsForOneDay(10);
    this.upperBaseline = this.createFakeChartPointsForOneDay(90);
  }

  createFakeChartPointsForOneDay(point: number) {
    const chartPoints: ChartPoint[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60 ; minute = minute + 1) {
        for (let seconds = 0; seconds < 60 ; seconds = seconds + 1) {
          chartPoints.push({x: new Date(2020, 4, 20, hour, minute, seconds, 100), y: ((Math.random() * (20 + hour)) + point)});
        }
      }
    }
    return chartPoints;
  }
}
