import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentData } from "@angular/fire/firestore";
import { calculateEpisodeIndependence } from "src/analysis/analysis";
import { Observable, Subject, of } from "rxjs";
import { Episode, Char } from "src/analysis/interface-show";
import { AngularFireModule } from "@angular/fire";
import { fbConfig } from "./../../firebase/firebase-config.js";

@Injectable({
  providedIn: "root",
})
export class FirebaseDataService {
  graphData$: Subject<any>;
  seasons$: Observable<number>;
  season$: Subject<Episode[] | DocumentData[]>;
  chars$: Subject<Char[]>;
  episode$: Subject<Episode | DocumentData>;

  constructor(private db: AngularFirestore) {
    console.log(AngularFireModule.initializeApp(fbConfig));
    console.log(fbConfig);
    AngularFireModule.initializeApp(fbConfig);
    this.seasons$ = of(7);
    console.log(this.db.collection("season_1").get());
  }

  setGraph(season, episode = null, chars) {}

  getData$() {
    return this.db.collection("season_1").get();
    // .subscribe(snap => {
    // let epChars = [];
    // snap.forEach(doc =>
    //   epChars.push(
    //     getCharacterSignatures(doc.data().chars, doc.data().scenes)
    //   )
    // );
    // console.log(epChars);
    // let concomitant = [];
    // snap.forEach(doc => {
    //   concomitant.push(
    //     calculateEpisodeIndependence(doc.data().chars, doc.data().scenes)
    //   );
    // });
    // console.log(concomitant);
    // });
  }

  // getAllSeasons() {
  //   return this.db.collection("season_1").get();
  // }

  getListEpisodes(season: number) {
    return this.db.collection("season_1").get();
  }

  getEpisode(season: number, episodeNum: number) {
    this.season$.subscribe((episodes) => {
      let ep;
      episodes.forEach((e) => {
        if (e.episodeNum === episodeNum) {
          ep = e;
        }
      });
      // const e = episodes.find((episode: Episode) => episode.episodeNum === episodeNum); thank you typescript
      this.episode$.next(ep);
    }); // +1 ?
  }

  getAllChars() {
    return this.db.collection("season_1").get();
  }

  getSeason(season: number) {
    this.db
      .collection(`season_${season}`)
      .get()
      .subscribe((snapshot) => {
        console.log("FirebaseDataService -> getSeason -> snapshot", snapshot);
        this.season$.next(snapshot.docs.map((doc) => doc.data()));
      });
  }
}
