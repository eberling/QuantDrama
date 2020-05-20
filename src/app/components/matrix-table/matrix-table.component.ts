import { Scene, Episode } from "src/analysis/interface-show";
import { GraphDataService } from "./../../services/graph-data.service";
import { Char, EpisodeChar } from "src/analysis/interface-show";
import { FirebaseDataService } from "./../../services/firebase-data.service";
import { Component, OnInit } from "@angular/core";
import { getCharacterSignatures } from "src/analysis/analysis";

@Component({
  selector: "app-matrix-table",
  templateUrl: "./matrix-table.component.html",
  styleUrls: ["./matrix-table.component.scss"],
})
export class MatrixTableComponent implements OnInit {
  chars: EpisodeChar[];
  scenes: Scene[];
  tableData;
  noData;

  constructor(private graphDataService: GraphDataService) {}

  ngOnInit() {
    this.graphDataService.tableData$.subscribe(
      (data: { epChars: EpisodeChar[]; episode: Episode }) => {
        if (data) {
          this.chars = data.epChars;
          this.scenes = data.episode.scenes;
        } else {
          console.log("no data ");
          this.scenes = null;
          this.chars = null;
        }
      }
    );
  }

  appearsIn(char, scene) {
    // console.log("has been called", char, scene);
    return false;
  }
}
