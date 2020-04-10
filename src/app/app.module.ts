import { AngularFirestore } from "angularfire2/firestore";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { AppGraphComponent } from "./components/graph/app-graph.component";
import { fbConfig } from "../firebase/firebase-config.js";
import { AngularFireModule, FirebaseOptionsToken } from "angularfire2";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxGraphModule,
    AngularFireModule.initializeApp(fbConfig),
  ],
  declarations: [AppComponent, AppGraphComponent],
  bootstrap: [AppComponent],
  providers: [AngularFirestore],
})
export class AppModule {}
