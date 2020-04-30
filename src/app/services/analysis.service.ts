import {
  Char,
  Scene,
  EpisodeChar,
  DynamicPair,
} from "src/analysis/interface-show";
import { map } from "rxjs/operators";
import { Subject, Observable, combineLatest } from "rxjs";
import { FirebaseDataService } from "./firebase-data.service";
import { Injectable } from "@angular/core";
import {
  calculateEpisodeAlternativity,
  calculateEpisodeIndependence,
  calculateSceneDensity,
  filterCharsFromEpisode,
  getCharacterSignatures,
  calculateEpisodeConcomitance,
  calculateEpisodeDensity,
  calculateEpisodeDominance,
} from "src/analysis/analysis";

@Injectable({
  providedIn: "root",
})
export class AnalysisService {
  graphData: any[];
  dynamicsArray = [
    { alternativity: calculateEpisodeAlternativity },
    { concomitance: calculateEpisodeConcomitance },
    { dominance: calculateEpisodeDominance },
    { independence: calculateEpisodeIndependence },
  ];
  graphLinks$ = new Subject();
  graphNodes$ = new Subject();
  // graphInput$: Observable<any>;

  constructor(private dataService: FirebaseDataService) {
    this.dataService.graphFormData$.subscribe((x) => {
      console.log(x);
      this.graphData = x;
    });
  }

  _getDynamicFunctions(
    selectedDynamics
  ): ((c: Char[], s: Scene[]) => DynamicPair[])[] {
    return selectedDynamics.map((dynamicName) => {
      const fnObjects = this.dynamicsArray.find((d) =>
        Object.keys(d).includes(dynamicName)
      );
      return Object.values(fnObjects)[0];
    });
  }

  _buildGraphLinks(dynamicsPairs: DynamicPair[]) {
    return dynamicsPairs.map((dynamicPair) => {
      console.log("rel", dynamicPair);
      const id =
        dynamicPair.chars[0].name +
        "+" +
        dynamicPair.chars[1].name +
        "+" +
        dynamicPair.dynamicType;
      const graphLinkObject = {
        // id: id,
        source: dynamicPair.chars[0].name,
        target: dynamicPair.chars[1].name,
        label: dynamicPair.dynamicType,
      };
      return graphLinkObject;
    });
  }

  prepareLinks() {
    if (!this.graphData) {
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
    const [chars, selectedDynamics, episode, season] = [...this.graphData];
    // with passed function names retrieve callable functions from all functions object
    const dynamicFunctions = this._getDynamicFunctions(selectedDynamics);
    console.log(
      "AnalysisService -> prepareLinks -> dynamicFunctions",
      dynamicFunctions
    );
    // call each selected function, generating edges

    const graphLinks = dynamicFunctions.map((callableDynamicFn) => {
      const dynamicsPairs = callableDynamicFn(chars, episode.scenes);
      return this._buildGraphLinks(dynamicsPairs);
      // { id: 'a', source: 'first', target: 'second', label: 'is parent of' }
    });
    console.log("graphlinks", graphLinks);
    this.graphLinks$.next(graphLinks);
  }

  prepareNodes() {
    if (!this.graphData) {
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
    const chars = this.graphData[0];
    const nodes = chars.map((char) => {
      const label = char.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
      return { id: char, label: label };
    });
    console.log("prepareNodes", nodes);
    this.graphNodes$.next(nodes);
  }

  // 0: (3) ["SISKO", "CREWMAN", "DEELA"]
  // 1: ["dominance"]
  // 2: {episodeNum: 4, title: "Cardassians", scenes: Array(23), chars: Array(19), season: 2}
  // 3: Array(26)
  // 0: {scenes: Array(23), chars: Array(19), season: 2, episodeNum: 0, title: "The Homecoming"}
  // 1: {episodeNum: 1, title: "The Circle", scenes: Array(25), chars: Array(22), season: 2}
  // 2: {title: "The Siege", scenes: Array(44), chars: Array(23), season: 2, episodeNum: 2}
  // 3: {title: "Invasive Procedures", scenes: Array(24), chars: Array(11), season: 2, episodeNum: 3}
  // 4: {episodeNum: 4, title: "Cardassians", scenes: Array(23), chars: Array(19), season: 2}
  // 5: {scenes: Array(43), chars: Array(13), season: 2, episodeNum: 5, title: "Melora"}
  // 6: {scenes: Array(23), chars: Array(16), season: 2, episodeNum: 6, title: "Rules of Acquisition"}
  // 7: {scenes: Array(19), chars: Array(14), season: 2, episodeNum: 7, title: "Necessary Evil"}
  // 8: {scenes: Array(22), chars: Array(13), season: 2, episodeNum: 8, title: "Second Sight"}
  // 9: {title: "Sanctuary", scenes: Array(25), chars: Array(21), season: 2, episodeNum: 9}
  // 10: {scenes: Array(37), chars: Array(14), season: 2, episodeNum: 10, title: "Rivals"}
  // 11: {scenes: Array(36), chars: Array(12), season: 2, episodeNum: 11, title: "The Alternate"}
  // 12: {scenes: Array(22), chars: Array(12), season: 2, episodeNum: 12, title: "Armageddon Game"}
  // 13: {scenes: Array(32), chars: Array(17), season: 2, episodeNum: 13, title: "Whispers"}
  // 14: {title: "Paradise", scenes: Array(22), chars: Array(10), season: 2, episodeNum: 14}
  // 15: {chars: Array(14), season: 2, episodeNum: 15, title: "Shadowplay", scenes: Array(22)}
  // 16: {chars: Array(14), season: 2, episodeNum: 16, title: "Playing God", scenes: Array(35)}
  // 17: {title: "Profit and Loss", scenes: Array(19), chars: Array(12), season: 2, episodeNum: 17}
  // 18: {chars: Array(12), season: 2, episodeNum: 18, title: "Blood Oath", scenes: Array(21)}
  // 19: {title: "The Maquis, part 1", scenes: Array(22), chars: Array(20), season: 2, episodeNum: 19}
  // 20: {episodeNum: 20, title: "The Maquis part↵2", scenes: Array(35), chars: Array(16), season: 2}
  // 21: {title: "The Wire", scenes: Array(21), chars: Array(12), season: 2, episodeNum: 21}
  // 22: {scenes: Array(22), chars: Array(14), season: 2, episodeNum: 22, title: "Crossover"}
  // 23: {chars: Array(14), season: 2, episodeNum: 23, title: "The Collaborator", scenes: Array(28)}
  // 24: {chars: Array(15), season: 2, episodeNum: 24, title: "Tribunal", scenes: Array(21)}
  // 25: {episodeNum: 25, title: "The Jem'Hadar", scenes: Array(40), chars: Array(15), season: 2}
}
