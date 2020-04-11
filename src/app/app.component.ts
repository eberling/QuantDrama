import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { AnalysisService } from "./services/analysis.service";
import { Observable, Subject, combineLatest } from "rxjs";
import { FirebaseDataService } from "./services/firebase-data.service";
import { Component, OnInit } from "@angular/core";
import { debounce, debounceTime, filter, map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  seasons: Array<number>;
  form: FormGroup;

  constructor(
    private dataService: FirebaseDataService,
    private analysisService: AnalysisService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.dataService.seasons$.subscribe((num) => (this.seasons = Array(num)));
    this.form = this.fb.group({
      chars: new FormGroup({}),
      dynamics: new FormGroup({}),
    });
    this.initForms();
    console.log("t");
    this.onFormChanges();

    combineLatest(
      this.dataService.selectedChars$,
      this.dataService.selectedDynamics$,
      this.dataService.episode$,
      this.dataService.season$
    ).subscribe((x) => console.log(x));
  }

  initForms() {
    this.dataService.chars$.subscribe((chars) => {
      const checkboxes = <FormGroup>this.form.get("chars");
      if (chars) {
        chars.forEach((char: string) => {
          checkboxes.addControl(char, new FormControl(false));
        });
      }
    });

    const dynamicsForm = <FormGroup>this.form.get("dynamics");
    this.analysisService.dynamicsArray.forEach((dynamic) => {
      console.log(Object.keys(dynamic)[0]);
      dynamicsForm.addControl(Object.keys(dynamic)[0], new FormControl(false));
    });
  }

  onSeasonSelect(season) {
    this.dataService.setSeason(season);
  }

  onEpisodeSelect(episode) {
    this.dataService.setEpisode(episode);
  }

  onCharSelect(e) {
    this.dataService.selectedChars$.next(e.target.value);
    console.log(e.target.value);
  }

  onFormChanges(): void {
    console.log("g");
    this.form.controls.chars.valueChanges
      .pipe(
        debounceTime(100),
        map((charObj) =>
          Object.entries(charObj)
            .filter(([key, val]) => val)
            .map((e) => e[0])
        )
      )
      .subscribe((checkedBoxes) => {
        this.dataService.selectedChars$.next(checkedBoxes);
      });
    // this should be an observable, combineLatest style?
    this.form.controls.dynamics.valueChanges
      .pipe(
        map((dynamicsObj) => {
          return Object.entries(dynamicsObj)
            .filter(([key, val]) => val)
            .map((e) => e[0]);
        })
      )
      .subscribe((checkedBoxes) => {
        console.log(checkedBoxes);
        this.dataService.selectedDynamics$.next(checkedBoxes);
      });
  }

  draw() {
    this.analysisService.prepareGraphData(["concomitance", "dominance"]);
  }
}
