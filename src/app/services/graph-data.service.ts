import {
  Char,
  Scene,
  DynamicPair,
  Episode,
  EpisodeChar,
} from "src/analysis/interface-show";
import {
  Subject,
  combineLatest,
  BehaviorSubject,
  forkJoin,
  of,
  Observable,
} from "rxjs";
import { FirebaseDataService } from "./firebase-data.service";
import { Injectable } from "@angular/core";
import {
  calculateEpisodeAlternativity,
  calculateEpisodeIndependence,
  calculateEpisodeConcomitance,
  calculateEpisodeDominance,
  getCharacterSignatures,
  calculateJaccard,
  calculateEpisodeDensity,
} from "src/analysis/analysis";
import {
  map,
  switchMap,
  reduce,
  concatMap,
  flatMap,
  mergeMap,
  mergeMapTo,
  concatAll,
  toArray,
  tap,
  mergeAll,
} from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class GraphDataService {
  graphFormData;
  episodeDensity;
  showGraph = false;

  dynamicsArray = [
    { alternativity: calculateEpisodeAlternativity },
    { concomitance: calculateEpisodeConcomitance },
    { dominance: calculateEpisodeDominance },
    { independence: calculateEpisodeIndependence },
  ];

  graphLinks$ = new BehaviorSubject(null);
  graphNodes$ = new BehaviorSubject(null);
  tableData$ = new BehaviorSubject(null);

  allGraphData = combineLatest(
    this.dataService.selectedChars$,
    this.dataService.selectedDynamics$,
    this.dataService.selectedEpisode$
  );

  constructor(private dataService: FirebaseDataService) {
    this.allGraphData.subscribe(([chars, dynamics, episode]) => {
      if (this.showGraph) {
        this.graphFormData = true;
        this.updateLinks(chars, dynamics, episode);
        this.updateNodes(chars);
      }
      this.updateEpCharsForMatrix(chars, episode);
    });

    this.dataService.selectedEpisode$.subscribe((episode) => {
      this.episodeDensity = calculateEpisodeDensity(
        episode.chars,
        episode.scenes
      );
    });
  }

  countDominations() {
    let final = [1, 2, 3, 4, 5, 6, 7].map((num) => {
      return this.dataService.getEpisodes$(num).pipe(
        map((episodes: Episode[]) => {
          let someArray = [];
          episodes.forEach((episode) => {
            const dynamicFunctions = this._getDynamicFunctions([
              "alternativity",
              "concomitance",
              "dominance",
            ]);
            // call each selected function, generating edges
            let graphLinks = dynamicFunctions.map((callableDynamicFn) => {
              const dynamicsPairs = callableDynamicFn(
                [
                  "QUARK",
                  "BASHIR",
                  "ODO",
                  "SISKO",
                  "JAKE",
                  "DAX",
                  "O'BRIEN",
                  "KIRA",
                ],
                episode.scenes
              );
              return this._buildGraphLinks(dynamicsPairs);
            });
            someArray.push(graphLinks);
          });
          const domsFlat = someArray
            .map((arr) => {
              return arr[1];
            })
            .reduce((acc, curr) => acc.concat(curr));
          let domCount = {};
          domsFlat.forEach((dom) => {
            if (domCount[dom.source]) {
              domCount[dom.source] += 1;
            } else {
              domCount[dom.source] = 1;
            }
          });
          console.log("yes", domCount);
          return domCount;
        })
      );
    });
    forkJoin(final).subscribe((check) => {
      console.log("All Dominations counted:", check);
    });
  }

  calcJaccard() {
    let final = [1, 2, 3, 4, 5, 6, 7].map((num) => {
      return this.dataService.getEpisodes$(num).pipe(
        map((episodes: Episode[]) => {
          return episodes
            .map((episode) => {
              return calculateJaccard(episode.chars, episode.scenes);
            })
            .sort()
            .filter((array) => array.length > 0);
        })
      );
    });

    forkJoin(final).subscribe((seasons) => {
      console.log("THIS IS IT GUYS ", seasons);
      const pairs = seasons.map((season) =>
        season.map((episodes) => episodes.map((episode) => episode.pair))
      );
      console.log("just the pairs", pairs);
    });
  }

  getAllUniqueChars() {
    let nums = of(1, 2, 3, 4, 5, 6, 7);
    let seasons = nums.pipe(
      concatMap(
        (num) => <Observable<Episode[]>>this.dataService.getEpisodes$(num)
      ),
      toArray()
    );
    const arrayOfSeasonsOfEpisodesOfChars = seasons.pipe(
      map((seasons) => {
        return seasons.map((season) => {
          return season.map((episode) => {
            return episode.chars.map((char) => char.trim());
          });
        });
      })
    );
    const flattenedChars = arrayOfSeasonsOfEpisodesOfChars.pipe(
      map((tripleNested) =>
        tripleNested
          .reduce((acc, curr) => acc.concat(curr))
          .reduce((acc, curr) => acc.concat(curr))
      ),
    );
    flattenedChars.subscribe((chars) => {
      const flatt = new Set(chars);
      console.log(flatt);
    });
  }

  getAllUniqueCharsAndCount(): Observable<any[]> {
    let nums = of(1, 2, 3, 4, 5, 6, 7);
    let seasons = nums.pipe(
      concatMap(
        (num) => <Observable<Episode[]>>this.dataService.getEpisodes$(num)
      ),
      toArray()
    );
    const arrayOfSeasonsOfEpisodesOfChars = seasons.pipe(
      map((seasons) => {
        return seasons.map((season) => {
          return season.map((episode) => {
            return episode.chars.map((char) => char.trim());
          });
        });
      })
    );
    const flattenedChars = arrayOfSeasonsOfEpisodesOfChars.pipe(
      map((tripleNested) =>
        tripleNested
          .reduce((acc, curr) => acc.concat(curr))
          .reduce((acc, curr) => acc.concat(curr))
      ),
    );
    const counted = flattenedChars.pipe(
      map((chars) => {
        let result: any = {};
        for (let i = 0; i < chars.length; ++i) {
          if (!result[chars[i]]) {
            result[chars[i]] = 0;
          }
          ++result[chars[i]];
        }
        return result;
      })
    );
    return counted;
  }

  _getDynamicFunctions(
    selectedDynamics
  ): ((c: Char[] | string[], s: Scene[]) => DynamicPair[])[] {
    return selectedDynamics.map((dynamicName) => {
      const fnObjects = this.dynamicsArray.find((d) =>
        Object.keys(d).includes(dynamicName)
      );
      return Object.values(fnObjects)[0];
    });
  }

  _buildGraphLinks(dynamicsPairs: DynamicPair[]) {
    console.log(
      "GraphDataService -> _buildGraphLinks -> dynamicsPairs",
      dynamicsPairs
    );
    if (!dynamicsPairs) {
      return null;
    }
    return dynamicsPairs.map((dynamicPair) => {
      const id =
        dynamicPair.chars[0].name +
        "+" +
        dynamicPair.chars[1].name +
        "+" +
        dynamicPair.dynamicType;
      const graphLinkObject = {
        source: dynamicPair.chars[0].name,
        target: dynamicPair.chars[1].name,
        label: dynamicPair.dynamicType,
      };
      console.log(
        "GraphDataService -> _buildGraphLinks -> graphLinkObject",
        graphLinkObject
      );
      return graphLinkObject;
    });
  }

  updateEpCharsForMatrix(chars, episode: Episode) {
    const epChars: EpisodeChar[] = getCharacterSignatures(
      chars,
      episode.scenes
    );
    this.tableData$.next({ epChars, episode });
  }

  updateLinks(chars, dynamics, episode) {
    console.log("debug 1");
    if (!this.graphFormData) {
      this.graphLinks$.next([
        [
          {
            source: "QUARK",
            target: "BATSMAN",
            label: "alternative",
            id: "aogl5",
          },
          {
            source: "ALIEN",
            target: "BASHIR",
            label: "alternative",
            id: "a5ele",
          },
          {
            source: "SISKO",
            target: "QUARK",
            label: "dominance",
          },
          {
            source: "ALIEN",
            target: "BATSMAN",
            label: "alternative",
            id: "a9073",
          },
          {
            source: "BASHIR",
            target: "BATSMAN",
            label: "alternative",
            id: "a0vny",
          },
        ],
        [],
      ]);
      return;
    }
    // with passed function names retrieve callable functions from all functions object
    const dynamicFunctions = this._getDynamicFunctions(dynamics);
    // call each selected function, generating edges
    let graphLinks = dynamicFunctions.map((callableDynamicFn) => {
      const dynamicsPairs = callableDynamicFn(chars, episode.scenes);
      return this._buildGraphLinks(dynamicsPairs);
    });
    if (!graphLinks || !graphLinks[0]) {
      console.log("debug 2", graphLinks);
      this.graphLinks$.next([]);
    } else {
      // Flatten all dynamicType Arrays to one Array
      const flattened = graphLinks.reduce((acc, curr) => acc.concat(curr));
      console.log("GraphDataService -> updateLinks -> graphLinks", graphLinks);
      console.log("GraphDataService -> updateLinks -> flattened", flattened);
      this.graphLinks$.next(flattened);
    }
  }

  updateNodes(chars) {
    if (!chars) {
      this.graphNodes$.next(null);
      return;
    }
    if (!this.graphFormData) {
      // demo data
      this.graphNodes$.next([
        {
          id: "SISKO",
          label: "Sisko",
          meta: {
            forceDimensions: false,
          },
          dimension: {
            width: 50.203125,
            height: 30,
          },
          position: {
            x: 0,
            y: 0,
          },
          data: {
            color: "#adcded",
          },
        },
        {
          id: "QUARK",
          label: "Quark",
          meta: {
            forceDimensions: false,
          },
          dimension: {
            width: 54.09375,
            height: 30,
          },
          position: {
            x: 0,
            y: 0,
          },
          data: {
            color: "#aae3f5",
          },
        },
        {
          id: "ALIEN",
          label: "Alien",
          meta: {
            forceDimensions: false,
          },
          dimension: {
            width: 47.90625,
            height: 30,
          },
          position: {
            x: 0,
            y: 0,
          },
          data: {
            color: "#a8385d",
          },
        },
        {
          id: "BASHIR",
          label: "Bashir",
          meta: {
            forceDimensions: false,
          },
          dimension: {
            width: 55.171875,
            height: 30,
          },
          position: {
            x: 0,
            y: 0,
          },
          data: {
            color: "#7aa3e5",
          },
        },
        {
          id: "BATSMAN",
          label: "Batsman",
          meta: {
            forceDimensions: false,
          },
          dimension: {
            width: 69.421875,
            height: 30,
          },
          position: {
            x: 0,
            y: 0,
          },
          data: {
            color: "#a27ea8",
          },
        },
      ]);
      return;
    }
    const nodes = chars.map((char) => {
      const label = char.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
      return { id: char, label: label };
    });
    console.log("prepareNodes", nodes);
    this.graphNodes$.next(nodes);
  }
}
