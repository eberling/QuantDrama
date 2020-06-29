import { Episode } from "src/analysis/interface-show";
import { map } from "rxjs/operators";
import { ChartDataService } from "../../services/chart-data.service";
import { GraphDataService } from "../../services/graph-data.service";
import { Component } from "@angular/core";
// import { multi } from "./data";

@Component({
  selector: "app-hamming-chart",
  templateUrl: "./app-hamming-chart.component.html",
  styleUrls: ["./app-hamming-chart.component.scss"],
})
export class AppHammingChartComponent {
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
  xAxisLabel = "Characters";
  showYAxisLabel = true;
  yAxisLabel = "# of episodes";

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

  constructor(public chartDataService: ChartDataService) {
    chartDataService.dynamicHammingChartData$
      .pipe(
        map((data) => {
          return data.slice(0, 50);
        })
      )
      .subscribe((x) => {
        this.dynamicHammingData = x;
        this.odoQuark();
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

  odoQuark() {
    const chars = ["ODO", "QUARK"];

    let chartData = [];
    for (let index = 1; index < 8; index++) {
      let seasonBlock = { name: `Season ${index}` };

      let series = [
        { name: "dominates" },
        { name: "alternative" },
        { name: "concomitant" },
      ];

      const seriesWithValues = series.map((dynamic) => {
        const odoQuarkDyn = this.dynamicHammingData.find((el) => {
          const isDyn = el.dynamicType === dynamic.name;
          const isOdo = el.pair.includes("ODO");
          const isQuark = el.pair.includes("QUARK");
          return isDyn && isOdo && isQuark;
        });

        let hammingArr: {
          episode: Episode;
          hammingObject: {
            hamming: number;
            relativeHamming: number;
          };
        }[] = [];

        if (odoQuarkDyn) {
          hammingArr = odoQuarkDyn.episodesWithHamming.filter((el) => {
            return el.episode.season === index;
          });
        }
        const total = hammingArr.reduce((acc, curr) => {
          return acc + curr.hammingObject.hamming;
        }, 0);
        const avg = total / hammingArr.length;

        return { name: dynamic.name, value: avg ? avg : 0 };
      });

      seasonBlock["series"] = seriesWithValues;
      chartData.push(seasonBlock);
    }
    console.log(chartData);
    this.dynamicHammingChartData = chartData;
  }
}
