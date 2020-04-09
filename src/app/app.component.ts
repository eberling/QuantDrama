import { Observable } from "rxjs";
import { FirebaseDataService } from "./services/firebase-data.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  seasons: Array<number>;

  constructor(private dataService: FirebaseDataService) {
    dataService.seasons$.subscribe((num) => (this.seasons = Array(num)));
  }

  onSeasonSelect(season) {
    this.dataService.getSeason(season);
  }
}
