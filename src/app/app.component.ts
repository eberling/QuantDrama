import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { AnalysisService } from "./services/analysis.service";
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
  charForm: FormGroup;

  constructor(
    private dataService: FirebaseDataService,
    private analysisService: AnalysisService,
    private fb: FormBuilder
  ) {
    dataService.seasons$.subscribe((num) => (this.seasons = Array(num)));
    this.charForm = this.fb.group({
      chars: new FormArray([]),
    });
    dataService.chars$.subscribe((chars) => {
      const formControls = chars.forEach((char) => {
        const control = new FormControl(false);
        (this.charForm.controls.chars as FormArray).push(control);
      });
    });
    // return chars.map((c) => console.log(c));
  }

  onSeasonSelect(season) {
    this.dataService.setSeason(season);
  }

  onEpisodeSelect(episode) {
    this.dataService.setEpisode(episode);
  }

  onCharSelect(e) {
    console.log(e.target.value);
  }

  draw() {}
}
