import { links } from "./../exampleData";
import { Episode } from "src/analysis/interface-show";
import { EpisodeChar } from "src/analysis/interface-show";
import { Observable, observable, Subject } from "rxjs";
import { map, filter } from "rxjs/operators";
import { FirebaseDataService } from "./firebase-data.service";
import { GraphDataService } from "./graph-data.service";
import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
  providedIn: "root",
})
export class CsvDownloadService {
  seasonJSON;
  episodeJSON;
  graphCSV;
  matrixCSV;

  constructor(
    private dataService: FirebaseDataService,
    private graphDataService: GraphDataService,
    private sanitizer: DomSanitizer
  ) {
    this._prepareJSON(this.dataService.episodes$).subscribe(
      (data) => (this.seasonJSON = data)
    );
    this._prepareJSON(this.dataService.selectedEpisode$).subscribe(
      (data) => (this.episodeJSON = data)
    );
    this._prepareCSVGraph(this.graphDataService.graphLinks$).subscribe(
      (data) => (this.graphCSV = data)
    );
    this._prepareCSVMatrix(this.graphDataService.tableData$).subscribe(
      (data) => (this.matrixCSV = data)
    );
  }

  downloadSeasonJSON() {
    console.log(
      "CsvDownloadService -> downloadSeasonJSON -> downloadSeasonJSON"
    );
    // this.downloadFile(this.seasonJSON);
    this.downloadCSVBoi("season.json", this.seasonJSON, "text/json");
  }

  downloadEpisodeJSON() {
    // this.episodeJSON$.subscribe((x) => this.downloadFile(x));
  }

  downloadGraphCSV() {
    this.downloadCSVBoi(
      "graphCSV.csv",
      this.graphCSV,
      "text/csv;charset=utf-8;"
    );
  }

  downloadMatrixCSV() {
    this.downloadCSVBoi(
      "matrixCSV.csv",
      this.matrixCSV,
      "text/csv;charset=utf-8;"
    );
    // this.matrixCSV$.subscribe((x) => this.downloadFile(x));
  }

  _prepareJSON(obs: Observable<any>) {
    return obs.pipe(
      map((data) => {
        const json = JSON.stringify(data);
        return this.sanitizer.bypassSecurityTrustUrl(
          "data:text/json;charset=UTF-8," + encodeURIComponent(json)
        );
      })
    );
  }

  _prepareJSONSeason(obs: Observable<any>) {
    const out = obs.pipe(
      map((data) => {
        const seasonJson = JSON.stringify(data);
        return this.sanitizer.bypassSecurityTrustUrl(
          "data:text/json;charset=UTF-8," + encodeURIComponent(seasonJson)
        );
      })
    );
    return out;
  }

  _prepareCSVMatrix(obs: Observable<any>) {
    return obs.pipe(
      filter((data) => data),
      map((data: { epChars: EpisodeChar[]; episode: Episode }) => {
        let csv: string[] = [];

        let header: string[] = ["Character"];
        data.episode.scenes.map((scene) => {
          header.push(scene.sceneNum.toString());
        });

        csv.push(header.join(","));

        data.epChars.map((char) => {
          let row = [char.name];
          data.episode.scenes.map((scene) => {
            char.scenes.some(
              (charScene) =>
                charScene.sceneNum === scene.sceneNum &&
                charScene.title === scene.title
            )
              ? row.push("1")
              : row.push("0");
          });
          csv.push(row.join(","));
        });

        const outputCSV = csv.join("\r\n");
        console.log(outputCSV);
        // var uri = this.sanitizer.bypassSecurityTrustUrl(
        //   "data:text/csv;charset=UTF-8" + encodeURIComponent(outputCSV)
        // );
        return outputCSV;
      })
    );
  }

  _prepareCSVGraph(obs: Observable<any>) {
    return obs.pipe(
      filter((data) => data),
      map(
        (
          graphLinks: {
            id: string;
            label: string;
            source: string;
            target: string;
          }[]
        ) => {
          let csv: string[] = [];
          let header: string[] = ["source", "type", "target", "dynamic"];

          csv.push(header.join(","));

          graphLinks.map((link) => {
            console.log("link", link);
            const type = link.label === "dominates" ? "directed" : "undirected";
            const row: string[] = [link.source, type, link.target, link.label];
            console.log("_prepareCSVGraph -> row", row);
            csv.push(row.join(","));
          });

          const outputCSV = csv.join("\r\n");
          console.log(outputCSV);
          // var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/csv;charset=UTF-8" + encodeURIComponent(outputCSV))
          return outputCSV;
        }
      )
    );
  }

  downloadCSVBoi(filename, data, type) {
    const blob = new Blob([data], { type: type });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
