import { Episode } from "src/analysis/interface-show";
import { map } from "rxjs/operators";
import { ChartDataService } from "../../services/chart-data.service";
import { GraphDataService } from "../../services/graph-data.service";
import { Component } from "@angular/core";
// import { multi } from "./data";
import { arraysEqual } from "src/analysis/analysis";

@Component({
  selector: "app-dynamic-chart",
  templateUrl: "./app-dynamic-chart.component.html",
  styleUrls: ["./app-dynamic-chart.component.scss"],
})
export class AppDynamicChartComponent {
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
  yAxisLabel = "Sum of Relationships per Season";

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
  seasons: Episode[][];

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
    chartDataService.allSeasonsAsArray().subscribe((seasons) => {
      this.seasons = seasons;
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
        // { name: "Quark dominates" },
        { name: "Odo dominates" },
        { name: "alternative" },
        //         { name: "concomitant" },
      ];

      const seriesWithValues = series.map((dynamic) => {
        const odoQuarkDyn = this.dynamicHammingData.find((el) => {
          let dyn;
          let odoQuark;
          if (dynamic.name === "Quark dominates") {
            console.log("1");
            dyn = "dominates" === el.dynamicType;
            odoQuark = arraysEqual(el.pair, ["QUARK, ODO"]);
          } else if (dynamic.name === "Odo dominates") {
            console.log("2");
            dyn = "dominates" === el.dynamicType;
            odoQuark = arraysEqual(el.pair, ["ODO", "QUARK"]);
          } else {
            console.log("3,4");
            odoQuark = el.pair.includes("ODO") && el.pair.includes("QUARK");
            dyn = dynamic.name === el.dynamicType;
          }
          return dyn && odoQuark;
        });
        console.log("DYN", odoQuarkDyn);
        let seasonFound = [];

        if (odoQuarkDyn) {
          seasonFound = odoQuarkDyn.episodesWithHamming.filter((el) => {
            return el.episode.season === index;
          });
        }
        console.log("SEASONFOUND", seasonFound);
        return { name: dynamic.name, value: seasonFound.length };
      });

      seasonBlock["series"] = seriesWithValues;
      chartData.push(seasonBlock);
    }
    console.log(chartData);
    this.dynamicHammingChartData = chartData;
  }

  odoQuarkAppearances() {
    const chars = ["ODO", "QUARK"];

    let chartData = [];
    for (let index = 1; index < 8; index++) {
      let seasonBlock = { name: `Season ${index}` };

      let series = [{ name: "QUARK" }, { name: "ODO" }];

      const seriesWithValues = series.map((dynamic) => {
        this.seasons.map((season) => {});
        const odoQuarkDyn = this.dynamicHammingData.find((el) => {
          let dyn;
          let odoQuark;
          if (dynamic.name === "Quark dominates") {
            console.log("1");
            dyn = "dominates" === el.dynamicType;
            odoQuark = arraysEqual(el.pair, ["QUARK, ODO"]);
          } else if (dynamic.name === "Odo dominates") {
            console.log("2");
            dyn = "dominates" === el.dynamicType;
            odoQuark = arraysEqual(el.pair, ["ODO", "QUARK"]);
          } else {
            console.log("3,4");
            odoQuark = el.pair.includes("ODO") && el.pair.includes("QUARK");
            dyn = dynamic.name === el.dynamicType;
          }
          return dyn && odoQuark;
        });
        console.log("DYN", odoQuarkDyn);
        let seasonFound = [];

        if (odoQuarkDyn) {
          seasonFound = odoQuarkDyn.episodesWithHamming.filter((el) => {
            return el.episode.season === index;
          });
        }
        console.log("SEASONFOUND", seasonFound);
        return { name: dynamic.name, value: seasonFound.length };
      });

      seasonBlock["series"] = seriesWithValues;
      chartData.push(seasonBlock);
    }
    console.log(chartData);
    this.dynamicHammingChartData = chartData;
  }
}
