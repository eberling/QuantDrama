import { Episode } from 'src/analysis/interface-show';
import { FirebaseDataService } from './firebase-data.service';
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { GraphDataService } from "./graph-data.service";
import { Injectable } from "@angular/core";
import {
  sumAllDynamicsForSeason
} from "src/analysis/analysis";

@Injectable({
  providedIn: "root",
})
export class ChartDataService {
  countedCharsChartData$: Observable<any[]>;

  constructor(private graphDataService: GraphDataService, private dataService: FirebaseDataService) {
    this.countedCharsChartData$ = this.charCountData();
    console.log("ser loaded")
    this.dataService.getEpisodes$(1).subscribe((episodes: Episode[]) => {
      const x = sumAllDynamicsForSeason(episodes)
      console.log("XX", x);
    })
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

}
