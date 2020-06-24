# ng2-charts-boundary-lines

Chart and edit boundary lines for Angular based on 
[Chart.js](https://github.com/chartjs/Chart.js) 
(with 
[zoom plugin](https://github.com/chartjs/chartjs-plugin-zoom) 
and 
[dragdata plugin](https://github.com/chrispahm/chartjs-plugin-dragData)
)
and 
[ng2-charts](https://github.com/valor-software/ng2-charts).

![](https://user-images.githubusercontent.com/3582380/85585067-fb16ed00-b63f-11ea-80df-5c917fc33a22.gif)

* Charts measurements and boundary lines as time series
* Filters time series
  * Filters x-values by a certain amount of maximum ticks
  * Aggregates data in between ticks according to different strategies (e.g., show maximum value in between ticks)
* Change boundary lines
  * Drag data points of boundary lines to change them
  * Instantly emits changed values
  * Interpolates data between ticks linearly
* Zoom and pan
  * Zoom and pan using your mouse or finger
  * Filters data by start and end time on the x-axis to only render necessary data 

# Usage

## Installation

1. You can install ***ng2-charts-boundary-lines*** using npm

  ```bash
  npm install ng2-charts-boundary-lines --save
  ```

2. You need to install `Chart.js`, ng2-charts`, and some plugins in your application as they are peer dependencies

  ```bash
  npm install chart.js --save
  npm install chartjs-plugin-annotation --save
  npm install chartjs-plugin-dragdata --save
  npm install chartjs-plugin-zoom --save
  npm install hammerjs --save
  npm install help --save
  npm install ng2-charts --save
  ```

## Integration
```typescript
import { Ng2ChartsBoundaryLinesModule } from 'ng2-charts-boundary-lines';

// In your app's module:
imports: [
   Ng2ChartsBoundaryLinesModule
]
```

## Usage
```html
<ng2-charts-boundary-lines
  [traces]="traces"              
  [(lowerBaseline)]="lowerBaseline"
  [(upperBaseline)]="upperBaseline"
  [maxDataPoints]="48"           
  [width]=1000                   
  [height]=800>                  
</ng2-charts-boundary-lines>
```

### Input values

| Name            | Type                                                         | Description        | Required | Default   |
| --------------- | ------------------------------------------------------------ | ------------------ | -------- | --------- |
| `traces`        | [`ChartPoint[]`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/chart.js/index.d.ts#L252) | Actual measuements | Yes      | undefined |
| `lowerBaseline` | [`ChartPoint[]`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/chart.js/index.d.ts#L252) | Lower boundaries   | Yes      | undefined |
| `upperBaseline` | [`ChartPoint[]`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/chart.js/index.d.ts#L252) | Upper boundaries   | Yes      | undefined |
| `maxDataPoints` | number                                                       | Amount of ticks    | No       | 48        |
| `width`         | number                                                       | Width of chart     | No       | undefined |
| `height`        | number                                                       | Height of chart    | No       | undefined |

### Output values

| Name                  | Type                                                         | Description      |
| --------------------- | ------------------------------------------------------------ | ---------------- |
| `lowerBaselineChange` | [`ChartPoint[]`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/chart.js/index.d.ts#L252) | Adapted lower boundaries |
| `upperBaselineChange` | [`ChartPoint[]`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/chart.js/index.d.ts#L252) | Adapted upper boundaries |

# Run from source 

## Library 
`/projects/ng2-charts-boundary-lines` is the root directory for the library.

`/projects/ng2-charts-boundary-lines-demo` is an example app to demonstrate the library.

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Start demo app

Run `npm run start` and navigate to `http://localhost:4200/` to see the demo app.

# Troubleshooting

Please use [GitHub Issues](https://github.com/johanneskross/ng2-charts-boundary-lines/issues) to report bugs and feature requests.

Thank you!

## License

The MIT License (see the [LICENSE](https://github.com/johanneskross/ng2-charts-boundary-lines/blob/master/LICENSE) file for the full text)
