import {
  Char,
  Scene,
  DynamicPair,
  Episode,
  EpisodeChar,
} from "src/analysis/interface-show";
import { Subject, combineLatest, BehaviorSubject } from "rxjs";
import { FirebaseDataService } from "./firebase-data.service";
import { Injectable } from "@angular/core";
import {
  calculateEpisodeAlternativity,
  calculateEpisodeIndependence,
  calculateEpisodeConcomitance,
  calculateEpisodeDominance,
  getCharacterSignatures,
} from "src/analysis/analysis";

@Injectable({
  providedIn: "root",
})
export class GraphDataService {
  graphFormData;
  dynamicsArray = [
    { alternativity: calculateEpisodeAlternativity },
    { concomitance: calculateEpisodeConcomitance },
    { dominance: calculateEpisodeDominance },
    { independence: calculateEpisodeIndependence },
  ];
  graphLinks$ = new Subject();
  graphNodes$ = new Subject();

  tableData$ = new BehaviorSubject(null);

  constructor(private dataService: FirebaseDataService) {
    combineLatest(
      this.dataService.selectedChars$,
      this.dataService.selectedDynamics$,
      this.dataService.selectedEpisode$
    ).subscribe((graphData) => {
      this.graphFormData = true;
      this.updateLinks(graphData[0], graphData[1], graphData[2]);
      this.updateNodes(graphData[0]);
      this.updateEpChars(graphData[0], graphData[2]);
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
      return graphLinkObject;
    });
  }

  updateEpChars(chars, episode: Episode) {
    const epChars: EpisodeChar[] = getCharacterSignatures(
      chars,
      episode.scenes
    );
    this.tableData$.next({ epChars, episode });
  }
  updateLinks(chars, dynamics, episode) {
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
    if (!graphLinks || graphLinks.length < 2 || !graphLinks[0]) {
      this.graphLinks$.next([]);
    } else {
      // Flatten all dynamicType Arrays to one Array
      console.log(graphLinks, " WTF ");
      const flattened = graphLinks.reduce((acc, curr) => acc.concat(curr));
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
