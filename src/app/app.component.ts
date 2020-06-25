import { CsvDownloadService } from "./services/csv-download.service";
import { AppGraphComponent } from "./components/graph/app-graph.component";
import { FormControl, FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { GraphDataService } from "./services/graph-data.service";
import { FirebaseDataService } from "./services/firebase-data.service";
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [],
})
export class AppComponent implements OnInit, OnDestroy {
  charsSubscription: Subscription;
  appGraphComponent: AppGraphComponent;
  form: FormGroup;
  appGraphComponentLoaded = false;
  allCharactersSelected = false;

  constructor(
    private dataService: FirebaseDataService,
    private graphDataService: GraphDataService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private csvService: CsvDownloadService
  ) {}

  ngOnInit() {
    // this.onModeSelect(false);
    this.form = this.fb.group({
      chars: new FormGroup({}),
      dynamics: new FormGroup({}),
    });
    this.initForms();
  }

  ngOnDestroy() {
    this.charsSubscription.unsubscribe();
  }

  initForms() {
    // adds char buttons
    this.charsSubscription = this.dataService.chars$.subscribe((chars) => {
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

    // adds relationships buttons
    const dynamicsForm = <FormGroup>this.form.get("dynamics");
    this.graphDataService.dynamicsArray.forEach((dynamic) => {
      const dynamicName = Object.keys(dynamic)[0];
      console.log(dynamicName);
      const box = new FormControl(false);
      dynamicsForm.addControl(dynamicName, box);
    });
  }

  onDraw(matrixOnly) {
    this.graphDataService.showGraph = !matrixOnly;

    const cCheckboxes = this.form.controls.chars.value;
    const chars = Object.entries(cCheckboxes)
      .filter(([key, val]) => val)
      .map((e) => e[0]);

    const dCheckboxes = this.form.controls.dynamics.value;
    const dyns = Object.entries(dCheckboxes)
      .filter(([key, val]) => val)
      .map((e) => e[0]);

    this.dataService.selectedChars$.next(chars);
    this.dataService.selectedDynamics$.next(dyns);

    // either changedetection or ngx-graph seems to cause trouble, but graph doesnt draw properly on first emission.
    if (!this.appGraphComponentLoaded) {
      setTimeout(() => {
        this.dataService.selectedDynamics$.next(dyns);
      }, 500);
      this.appGraphComponentLoaded = true;
    }
  }

  onSelectSeason(e) {
    this.dataService.episodes$.next(null);
    this.dataService.chars$.next(null);
    this.dataService.selectedChars$.next(null);
    this.graphDataService.tableData$.next(null);

    this.dataService.selectedSeason$.next(e.target.value);

    this.appGraphComponentLoaded = false;
  }

  onSelectEpisode(e) {
    this.dataService.selectedEpisode$.next(e);
    this.appGraphComponentLoaded = false;
  }

  onSelectAllChars(bool) {
    const checkboxes = this.form.get("chars").value;
    console.log(checkboxes);
    Object.keys(checkboxes).map((checkbox) => {
      this.form.get("chars").get(checkbox).setValue(bool);
    });
  }

  // // if true, selects seasonMode
  // onModeSelect(val) {
  //   this.dataService.episodes$.next(null);
  //   this.dataService.chars$.next(null);
  //   this.dataService.selectedChars$.next(null);
  //   this.graphDataService.tableData$.next(null);
  //   this.dataService.seasonMode$.next(val);
  // }

  _isDrawButtonActive() {
    const dBoxes = this.form.get("dynamics").value;
    const cBoxes = this.form.get("chars").value;
    const dValues = Object.values(dBoxes);
    const cValues = Object.values(cBoxes);
    const d = dValues.some((d) => !!d);
    const c = cValues.some((c) => !!c);
    return d && c;
  }

  _isEmpty(obj) {
    for (const x in obj) {
      return false;
    }
    return true;
  }
}
