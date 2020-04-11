import { Episode } from "src/analysis/interface-show";
import { Subject } from "rxjs";
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
  data$ = new Subject();

  dynamicsArray = [
    { alternativity: calculateEpisodeAlternativity },
    { concomitance: calculateEpisodeConcomitance },
    { dominance: calculateEpisodeDominance },
    { independence: calculateEpisodeIndependence },
  ];

  constructor(firebaseDataService: FirebaseDataService) {
    // firebaseDataService.selectedChars$.subscribe((x) => console.log(x));
    // firebaseDataService.episode$.subscribe();
  }

  prepareGraphData(selectedDynamics: any[], chars: string[], episode: Episode) {
    const dynamicFunctions = selectedDynamics.map((dynamicName) => {
      return this.dynamicsArray.find((dynObj) => {
        return Object.keys(dynObj).includes(dynamicName);
      });
    });
    console.log("f", dynamicFunctions);
    dynamicFunctions.forEach((dynFunc) => {
      // console.log(Object.values(dynFunc)[0]());
    });
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
