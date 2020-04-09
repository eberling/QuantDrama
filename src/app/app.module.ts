import {
  AngularFirestore,
  AngularFirestoreModule,
} from "@angular/fire/firestore";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { AppGraphComponent } from "./components/graph/app-graph.component";
import { AngularFireModule } from "@angular/fire";
import { fbConfig } from "../firebase/firebase-config.js";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxGraphModule,
    AngularFireModule.initializeApp(fbConfig),
    AngularFirestoreModule,
  ],
  declarations: [AppComponent, AppGraphComponent],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppModule {}
