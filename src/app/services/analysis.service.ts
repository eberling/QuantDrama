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
  relationships = {
    alternativity: calculateEpisodeAlternativity,
    concomitance: calculateEpisodeConcomitance,
    dominance: calculateEpisodeDominance,
    independence: calculateEpisodeIndependence,
  };

  constructor(firebaseDataService: FirebaseDataService) {
    firebaseDataService.selectedChars$.subscribe();
  }

  getRelationships() {
    return [
      calculateEpisodeAlternativity,
      calculateEpisodeConcomitance,
      calculateEpisodeDominance,
      calculateEpisodeDensity,
      calculateEpisodeIndependence,
    ];
  }
}
