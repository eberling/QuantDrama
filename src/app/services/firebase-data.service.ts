import { Injectable } from "@angular/core";
import { calculateEpisodeIndependence } from "src/analysis/analysis";
import { Observable, Subject, of, combineLatest } from "rxjs";
import { Episode, Char } from "src/analysis/interface-show";
import { AngularFirestore, DocumentData } from "angularfire2/firestore";

@Injectable({
  providedIn: "root",
})
export class FirebaseDataService {
  episode$: Subject<Episode> = new Subject();
  seasons$: Observable<number>;
  season$: Subject<Episode[] | DocumentData[]> = new Subject();
  chars$: Subject<String[]> = new Subject();
  selectedChars$: Subject<any> = new Subject();
  selectedDynamics$: Subject<any> = new Subject();
  graphData$: Subject<any>;
  graphFormData$: Observable<any>;

  constructor(private db: AngularFirestore) {
    this.seasons$ = of(7);
    this.episode$.subscribe((episode) => this.chars$.next(episode.chars));

    this.graphFormData$ = combineLatest(
      this.selectedChars$,
      this.selectedDynamics$,
      this.episode$,
      this.season$
    );
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

  getEpisode(episodeNum: number) {
    // this.season$.subscribe((episodes) => {
    //   let ep;
    //   episodes.forEach((e) => {
    //     if (e.episodeNum === episodeNum) {
    //       ep = e;
    //     }
    //   });
    //   // const e = episodes.find((episode: Episode) => episode.episodeNum === episodeNum); thank you typescript
    //   this.episode$.next(ep);
    // }); // +1 ?
  }

  getAllChars() {
    return this.db.collection("season_1").get();
  }

  setEpisode(episode: Episode) {
    // console.log(Object.keys(event));
    this.episode$.next(episode);
  }

  setSelectedChars(chars) {
    console.log(chars);
    this.selectedChars$.next(chars);
  }

  setSeason(season: number) {
    // console.log(`season_${season}`);
    this.db
      .collection(`season_${season}`)
      .get()
      .subscribe((snapshot) => {
        // console.log(
        //   "FirebaseDataService -> getSeason -> snapshot",
        // snapshot.docs;
        // );
        this.season$.next(
          snapshot.docs
            .map((doc) => {
              // console.log(doc.data());
              return doc.data();
            })
            .sort((a, b) => a.episodeNum - b.episodeNum)
        );
      });
  }
}
