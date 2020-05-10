import { FormControl, FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { GraphDataService } from "./services/graph-data.service";
import { FirebaseDataService } from "./services/firebase-data.service";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-root",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [],
})
export class AppComponent implements OnInit {
  form: FormGroup;

  constructor(
    private dataService: FirebaseDataService,
    private graphDataService: GraphDataService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      chars: new FormGroup({}),
      dynamics: new FormGroup({}),
    });
    this.initForms();
  }

  initForms() {
    this.dataService.chars$.subscribe((chars) => {
      const checkboxes = <FormGroup>this.form.get("chars");
      if (chars === null && !this._isEmpty(checkboxes)) {
        this.form.removeControl("chars");
        this.form.addControl("chars", new FormGroup({}));
      }
      if (chars) {
        Object.values(chars).forEach((char: string) => {
          checkboxes.addControl(char, new FormControl(false));
        });
      }
    });

    const dynamicsForm = <FormGroup>this.form.get("dynamics");
    this.graphDataService.dynamicsArray.forEach((dynamic) => {
      const dynamicName = Object.keys(dynamic)[0];
      console.log(dynamicName);
      const box = new FormControl(false);
      dynamicsForm.addControl(dynamicName, box);
      // dynamicsForm
      //   .get(dynamicName)
      //   .valueChanges.subscribe((checked) =>
      //     console.log({ [dynamicName]: checked })
      //   );
    });
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
    this.graphDataService.update();
  }

  onSelectSeason(e) {
    this.dataService.episodes$.next(null);
    this.dataService.chars$.next(null);
    this.dataService.selectedSeason$.next(e.target.value);
  }

  _isEmpty(obj) {
    for (const x in obj) {
      return false;
    }
    return true;
  }

  _isDrawButtonActive() {
    const dBoxes = this.form.get("dynamics").value;
    const cBoxes = this.form.get("chars").value;
    const dValues = Object.values(dBoxes);
    const cValues = Object.values(cBoxes);
    const d = dValues.some((d) => !!d);
    const c = cValues.some((c) => !!c);
    return d && c;
  }
}
