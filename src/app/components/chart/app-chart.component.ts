import { Component } from "@angular/core";
// import { multi } from "./data";

@Component({
  selector: "app-chart",
  templateUrl: "./app-chart.component.html",
  styleUrls: ["./app-chart.component.css"],
})
export class AppChartComponent {
  multi: any[];
  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = "Year";
  yAxisLabel: string = "Population";
  timeline: boolean = true;

  colorScheme = {
    domain: ["#5AA454", "#E44D25", "#CFC0BB", "#7aa3e5", "#a8385d", "#aae3f5"],
  };

  constructor() {
    // Object.assign(this, { multi });object.
  }

  onSelect(data): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }

  bla() {
    return [
      {
        name: "SISKO",
        series: [
          {
            name: "Season 1", //dominations
            value: 33, // dominations
          },
          {
            name: "Season 2",
            value: 33,
          },
          {
            name: "Season 3",
            value: 44,
          },
        ],
      },

      {
        name: "USA",
        series: [
          {
            name: "1990",
            value: 250000000,
          },
          {
            name: "2010",
            value: 309000000,
          },
          {
            name: "2011",
            value: 311000000,
          },
        ],
      },

      {
        name: "France",
        series: [
          {
            name: "1990",
            value: 58000000,
          },
          {
            name: "2010",
            value: 50000020,
          },
          {
            name: "2011",
            value: 58000000,
          },
        ],
      },
      {
        name: "UK",
        series: [
          {
            name: "1990",
            value: 57000000,
          },
          {
            name: "2010",
            value: 62000000,
          },
        ],
      },
    ];
  }
}
