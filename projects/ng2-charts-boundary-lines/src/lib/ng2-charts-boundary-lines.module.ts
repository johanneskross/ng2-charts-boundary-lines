import {NgModule} from '@angular/core';
import {Ng2ChartsBoundaryLinesComponent} from './ng2-charts-boundary-lines.component';
import {ChartsModule} from 'ng2-charts';


@NgModule({
  declarations: [
    Ng2ChartsBoundaryLinesComponent
  ],
  imports: [
    ChartsModule
  ],
  exports: [
    Ng2ChartsBoundaryLinesComponent
  ]
})
export class Ng2ChartsBoundaryLinesModule {
}
