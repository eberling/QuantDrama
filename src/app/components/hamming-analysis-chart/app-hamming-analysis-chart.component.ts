import { Episode } from "src/analysis/interface-show";
import { map } from "rxjs/operators";
import { ChartDataService } from "../../services/chart-data.service";
import { GraphDataService } from "../../services/graph-data.service";
import { Component } from "@angular/core";
// import { multi } from "./data";

@Component({
  selector: "app-hamming-analysis-chart",
  templateUrl: "./app-hamming-analysis-chart.component.html",
  styleUrls: ["./app-hamming-analysis-chart.component.scss"],
})
export class AppHammingAnalysisChartComponent {
  multi: any[];
  view: any[] = [700, 300];
  dynamicHammingData: {
    pair: string[];
    dynamicType: string;
    episodesWithHamming: {
      episode: Episode;
      hammingObject: {
        hamming: number;
        relativeHamming: number;
      };
    }[];
    totalRelHamming: number;
    totalAbsHamming: number;
  }[];
  dynamicHammingChartData;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Odo and Quark";
  showYAxisLabel = true;
  yAxisLabel = "Hamming Distance";

  colorScheme1 = {
    domain: ["#5AA454", "#E44D25", "#CFC0BB", "#7aa3e5", "#a8385d", "#aae3f5"],
  };
  colorScheme2 = {
    domain: [
      "#BCC4DB",
      "#C0A9B0",
      "#7880B5",
      "#6987C9",
      "#6BBAEC",
      "#beb7c6",
      "#6aa1db",
      "#7184BF",
    ],
  };
  colorScheme3 = {
    domain: ["#c70039", "#f37121", "#ffbd69"],
  };

  constructor(public chartDataService: ChartDataService) {
    chartDataService.dynamicHammingChartData$
      .pipe(
        map((data) => {
          return data.slice(0, 50);
        })
      )
      .subscribe((x) => {
        this.dynamicHammingData = x;
        this.distanceToAllOthers();
      });
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

  testData() {
    return [
      {
        name: "Germany",
        series: [
          {
            name: "2010",
            value: 73000000,
          },
          {
            name: "2011",
            value: 89400000,
          },
          {
            name: "1990",
            value: 62000000,
          },
        ],
      },

      {
        name: "USA",
        series: [
          {
            name: "2010",
            value: 309000000,
          },
          {
            name: "2011",
            value: 311000000,
          },
          {
            name: "1990",
            value: 250000000,
          },
        ],
      },

      {
        name: "France",
        series: [
          {
            name: "2010",
            value: 50000020,
          },
          {
            name: "2011",
            value: 58000000,
          },
          {
            name: "1990",
            value: 58000000,
          },
        ],
      },
      {
        name: "UK",
        series: [
          {
            name: "2010",
            value: 62000000,
          },
          {
            name: "1990",
            value: 57000000,
          },
        ],
      },
    ];
  }

  /*
   [
    {"name": "Kira"
    "series": {
      value: "Hamming Distance",
      name: "episode"
    }
    }

   ]
  */

  distanceToAllOthers() {
    const chars = [
      "BASHIR",
      "SISKO",
      "O'BRIEN",
      "DAX",
      "WORF",
      "KIRA",
      "ODO",
      "QUARK",
    ];
    let chartData = [];
    const seasonArray = this.chartDataService.allSeasonsAsArray();
    // for each episode, check for each pair what hamming distance they have
    seasonArray.pipe(map((x) => {}));
    for (let index = 1; index < 8; index++) {
      let seasonBlock = { name: `Season ${index}` };

      let series = [
        { name: "dominates" },
        { name: "alternative" },
        { name: "concomitant" },
        { name: "independent" },
      ];
      this.chartDataService.dynamicHammingChartData$;
    }
  }
}
