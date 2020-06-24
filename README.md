# ng2-charts-boundary-lines

Chart and edit boundary lines for Angular based on 
[Chart.js](https://github.com/chartjs/Chart.js) 
and 
[ng2-charts](https://github.com/valor-software/ng2-charts).

# Usage & Demo

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

# Documentation

`/projects/ng2-charts-boundary-lines` is the root directory for the library.

`/projects/ng2-charts-boundary-lines-demo` is an example app to demonstrate the library. 

Run `npm run start` from this git root directory and navigate to `http://localhost:4200/` to see the demo app.


## Troubleshooting

Please use [GitHub Issues](https://github.com/johanneskross/ng2-charts-boundary-lines/issues) to report bugs and feature requests.

Thank you!

### License

The MIT License (see the [LICENSE](https://github.com/johanneskross/ng2-charts-boundary-lines/blob/master/LICENSE) file for the full text)
