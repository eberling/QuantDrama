import { Episode } from "src/analysis/interface-show";
import { map } from "rxjs/operators";
import { ChartDataService } from "../../services/chart-data.service";
import { GraphDataService } from "../../services/graph-data.service";
import { Component } from "@angular/core";
// import { multi } from "./data";
import { arraysEqual } from "src/analysis/analysis";

@Component({
  selector: "app-line-dynamic-chart",
  templateUrl: "./app-line-dynamics-chart.component.html",
  styleUrls: ["./app-line-dynamics-chart.component.scss"],
})
export class AppLineDynamicsChartComponent {
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
        name: "Tunisia",
        series: [
          {
            value: 3587,
            name: "2016-09-18T20:33:14.902Z",
          },
          {
            value: 5802,
            name: "2016-09-22T01:12:35.469Z",
          },
          {
            value: 5970,
            name: "2016-09-20T09:53:53.226Z",
          },
          {
            value: 6026,
            name: "2016-09-15T04:04:25.634Z",
          },
          {
            value: 5117,
            name: "2016-09-17T12:40:53.514Z",
          },
        ],
      },
      {
        name: "Puerto Rico",
        series: [
          {
            value: 4939,
            name: "2016-09-18T20:33:14.902Z",
          },
          {
            value: 3266,
            name: "2016-09-22T01:12:35.469Z",
          },
          {
            value: 3452,
            name: "2016-09-20T09:53:53.226Z",
          },
          {
            value: 5733,
            name: "2016-09-15T04:04:25.634Z",
          },
          {
            value: 5550,
            name: "2016-09-17T12:40:53.514Z",
          },
        ],
      },
      {
        name: "Guinea",
        series: [
          {
            value: 3260,
            name: "2016-09-18T20:33:14.902Z",
          },
          {
            value: 6274,
            name: "2016-09-22T01:12:35.469Z",
          },
          {
            value: 3418,
            name: "2016-09-20T09:53:53.226Z",
          },
          {
            value: 6967,
            name: "2016-09-15T04:04:25.634Z",
          },
          {
            value: 3075,
            name: "2016-09-17T12:40:53.514Z",
          },
        ],
      },
      {
        name: "Mayotte",
        series: [
          {
            value: 3695,
            name: "2016-09-18T20:33:14.902Z",
          },
          {
            value: 2185,
            name: "2016-09-22T01:12:35.469Z",
          },
          {
            value: 4164,
            name: "2016-09-20T09:53:53.226Z",
          },
          {
            value: 5898,
            name: "2016-09-15T04:04:25.634Z",
          },
          {
            value: 3614,
            name: "2016-09-17T12:40:53.514Z",
          },
        ],
      },
      {
        name: "Rwanda",
        series: [
          {
            value: 6084,
            name: "2016-09-18T20:33:14.902Z",
          },
          {
            value: 2566,
            name: "2016-09-22T01:12:35.469Z",
          },
          {
            value: 4242,
            name: "2016-09-20T09:53:53.226Z",
          },
          {
            value: 2708,
            name: "2016-09-15T04:04:25.634Z",
          },
          {
            value: 6757,
            name: "2016-09-17T12:40:53.514Z",
          },
        ],
      },
    ];
  }

  /*
   [
    {"name": "Domination"
    "series": {
      value: "X Achse",
      name: "Y Achse"
    }
    }

   ]
  */
  odoQuark() {
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
