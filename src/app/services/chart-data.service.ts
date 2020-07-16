import { Episode } from "src/analysis/interface-show";
import { FirebaseDataService } from "./firebase-data.service";
import { Observable, Subject, of, forkJoin } from "rxjs";
import { map, mergeMap, toArray, tap, concatMap } from "rxjs/operators";
import { GraphDataService } from "./graph-data.service";
import { Injectable } from "@angular/core";
import {
  sumAllDynamicsForSeason,
  mergeAllDynamicsMaps,
  calculateHammingForSeason,
  combineHammingWithTvShowDynamicsMap,
  calculateHammingInEpisode,
} from "src/analysis/analysis";

@Injectable({
  providedIn: "root",
})
export class ChartDataService {
  countedCharsChartData$: Observable<any[]>;
  dynamicHammingChartData$: Observable<
    {
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
    }[]
  >;

  constructor(
    private graphDataService: GraphDataService,
    private dataService: FirebaseDataService
  ) {
    this.countedCharsChartData$ = this.charCountData();

    // this.dataService.getEpisodes$(1).subscribe((episodes: Episode[]) => {
    //   const x = sumAllDynamicsForSeason(episodes);
    //   const y = calculateHammingForSeason(episodes);
    //   combineHammingWithTvShowDynamicsMap(x, y);
    //   // const z = addHammingToSeasonDynamicsMap(x,y);
    // });

    this.dynamicHammingChartData$ = this.allSeasonsTopDynamicsData();
  }

  charCountData() {
    return this.graphDataService.getAllUniqueCharsAndCount().pipe(
      map((countedChars) => {
        const chartObject = Object.entries(countedChars).map((char) => {
          return { name: char[0], value: char[1] };
        });
        return chartObject;
      })
    );
  }

  allSeasonsAsArray() {
    const nums = of(1, 2, 3, 4, 5, 6, 7);
    return nums.pipe(
      concatMap(
        (num) => <Observable<Episode[]>>this.dataService.getEpisodes$(num)
      ),
      toArray()
    );
  }

  allSeasonsTopDynamicsData() {
    const nums = of(1, 2, 3, 4, 5, 6, 7);
    const seasons = this.allSeasonsAsArray();
    const data = seasons.pipe(
      map((seasons) => {
        console.log(
          "ChartDataService -> allSeasonsTopDynamicsData -> seasons",
          seasons
        );
        const maps = seasons.map((season) => sumAllDynamicsForSeason(season));
        const hammings = seasons.map((season) =>
          calculateHammingForSeason(season)
        );
        const flatHammings = hammings.reduce((acc, curr) => acc.concat(curr));
        // console.log(
        //   "ChartDataService -> allSeasonsTopDynamicsData -> maps",
        //   maps
        // );
        const merged = mergeAllDynamicsMaps(maps);

        const data = combineHammingWithTvShowDynamicsMap(merged, flatHammings);
        return data;
      })
    );
    return data;
  }
}
