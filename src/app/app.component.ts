import { Subject, BehaviorSubject } from "rxjs";
import { Observable, fromEventPattern } from "rxjs";
import { AppGraphComponent } from "./components/graph/app-graph.component";
import { FormControl, FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { AnalysisService } from "./services/analysis.service";
import { FirebaseDataService } from "./services/firebase-data.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { debounceTime, map } from "rxjs/operators";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ height: 0, opacity: 0 }),
        animate("0.2s ease-out", style({ height: "100%", opacity: 1 })),
      ]),
      transition(":leave", [
        style({ height: "100%", opacity: 1 }),
        animate("0.2s ease-in", style({ height: 0, opacity: 0 })),
      ]),
    ]),
    trigger("inOutOpacity", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("0.2s ease-out", style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate("0.s ease-in", style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  seasons$: Observable<number[]>;
  form: FormGroup;
  seasonMode = null;
  clicks$: Observable<any>;
  mode$ = new Subject();

  constructor(
    private dataService: FirebaseDataService,
    private analysisService: AnalysisService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.seasons$ = this.dataService.seasons$.pipe(map((num) => Array(num)));

    this.form = this.fb.group({
      chars: new FormGroup({}),
      dynamics: new FormGroup({}),
    });

    // this.dataService.season$.subscribe((season) => {
    //   this.form.get("season").setValue(season);
    // });

    // this.form.get("season").valueChanges.subscribe((season) => {
    //   this.dataService.season$.next(season);
    // });

    this.initForms();
    this.onFormChanges();
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

  onModeSelect(mode) {
    this.form.get("mode").valueChanges.subscribe();
  }

  resetForm() {}

  onCharSelect(e) {
    this.dataService.selectedChars$.next(e.target.value);
    console.log(e.target.value);
  }

  onDraw() {
    this.analysisService.prepareLinks();
    this.analysisService.prepareNodes();
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

  _isEmpty(obj) {
    for (var x in obj) {
      return false;
    }
    return true;
  }

  _isDynamicSelected() {
    console.log(
      "i dont even exist",
      this.form.get("dynamics").value,
      this.form.get("dynamics").value.some((d) => d)
    );
    this.form.get("dynamics").value.some((d) => d);
  }
}
