import { AppDynamicChartComponent } from "./components/dynamic-chart/app-dynamic-chart.component";
import { AngularFirestore } from "angularfire2/firestore";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { AppGraphComponent } from "./components/graph/app-graph.component";
import { fbConfig } from "../firebase/firebase-config.js";
import { AngularFireModule } from "angularfire2";
import { AppMatrixTableComponent } from "./components/matrix-table/app-matrix-table.component";
import { AppChartComponent } from "./components/chart/app-chart.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { SimplebarAngularModule } from "simplebar-angular";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { AppHammingChartComponent } from "./components/hamming-chart/app-hamming-chart.component";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxGraphModule,
    NgxChartsModule,
    AngularFireModule.initializeApp(fbConfig),
    PerfectScrollbarModule,
    SimplebarAngularModule,
  ],
  declarations: [
    AppComponent,
    AppGraphComponent,
    AppMatrixTableComponent,
    AppChartComponent,
    AppDynamicChartComponent,
    AppHammingChartComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    AngularFirestore,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class AppModule {}
