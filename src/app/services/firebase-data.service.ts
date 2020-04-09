import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentData } from "@angular/fire/firestore";
import { calculateEpisodeIndependence } from "src/analysis/analysis";
import { Observable, Subject, of } from "rxjs";
import { Episode, Char } from "src/analysis/interface-show";

@Injectable({
  providedIn: "root",
})
export class FirebaseDataService {
  graphData$: Subject<any>;
  seasons$: Observable<number>;
  episodes$: Subject<Episode[] | DocumentData[]>;
  selectableChars$: Subject<Char[]>;
  episode$: Subject<Episode | DocumentData>;

  constructor(private db: AngularFirestore) {
    this.seasons$ = of(7);
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
    this.episodes$.subscribe((episodes) =>
      this.episode$.next(
        episodes.find((episode) => episode.episodeNum === episodeNum)
      )
    ); // +1 ?
  }

  getAllChars() {
    return this.db.collection("season_1").get();
  }

  getSeason(season: number) {
    this.db
      .collection(`season_${season}`)
      .get()
      .subscribe((snapshot) => {
        this.episodes$.next(snapshot.docs.map((doc) => doc.data()));
      });
  }
}
