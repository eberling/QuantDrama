import { FormControl, FormGroup, FormArray, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { AnalysisService } from "./services/analysis.service";
import { FirebaseDataService } from "./services/firebase-data.service";
import { Component, OnInit } from "@angular/core";
import { debounceTime, map, tap } from "rxjs/operators";
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
  form: FormGroup;

  constructor(
    private dataService: FirebaseDataService,
    private analysisService: AnalysisService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      chars: new FormGroup({}),
      dynamics: new FormGroup({}),
    });

    this.initForms();
    this.dataService.episodes$.subscribe((x) => console.log(x));
  }

  initForms() {
    this.dataService.chars$.subscribe((chars) => {
      let checkboxes = <FormGroup>this.form.get("chars");

      if (chars === null && !this._isEmpty(checkboxes)) {
        this.form.removeControl("chars");
        this.form.addControl("chars", new FormGroup({}));
      }
      // checkboxes.reset(false);
      if (chars) {
        Object.values(chars).forEach((char) => {
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

  onCharSelect(e) {
    this.dataService.selectedChars$.next(e.target.value);
    console.log(e.target.value);
  }

  onDraw() {
    const cCheckboxes = this.form.controls.chars.value;
    const chars = Object.entries(cCheckboxes)
      .filter(([key, val]) => val)
      .map((e) => e[0]);
    this.dataService.selectedChars$.next(chars);

    const dCheckboxes = this.form.controls.dynamics.value;
    const dyns = Object.entries(dCheckboxes)
      .filter(([key, val]) => val)
      .map((e) => e[0]);
    this.dataService.selectedDynamics$.next(dyns);

    this.analysisService.prepareLinks();
    this.analysisService.prepareNodes();
  }

  _isEmpty(obj) {
    for (var x in obj) {
      return false;
    }
    return true;
  }

  _isDynamicSelected() {
    const dBoxes = this.form.get("dynamics").value;
    const cBoxes = this.form.get("chars").value;
    const dValues = Object.values(dBoxes);
    const cValues = Object.values(cBoxes);
    const d = dValues.some((d) => !!d);
    const c = cValues.some((c) => !!c);
    return d && c;
  }
}
