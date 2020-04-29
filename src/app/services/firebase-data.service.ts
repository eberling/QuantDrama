import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Observable, Subject, of, combineLatest, BehaviorSubject } from "rxjs";
import { Episode } from "src/analysis/interface-show";
import { AngularFirestore, DocumentData } from "angularfire2/firestore";

@Injectable({
  providedIn: "root",
})
export class FirebaseDataService {
  seasons$: Observable<number[]>;
  episodes$: Subject<Episode[] | DocumentData[]> = new Subject();
  chars$ = new Subject();
  charsCount$ = new Subject();
  selectedChars$: Subject<any> = new Subject();
  selectedEpisode$: Subject<Episode> = new Subject();
  selectedDynamics$: Subject<any> = new Subject();
  selectedSeason$: Subject<number> = new Subject();
  graphData$: Subject<any>;
  graphFormData$: Observable<any>;
  seasonMode$ = new BehaviorSubject(null);
  isLoading$ = new BehaviorSubject(false);

  constructor(private db: AngularFirestore) {
    this.seasons$ = of([1, 2, 3, 4, 5, 6, 7]);
    this.graphFormData$ = combineLatest(
      this.selectedChars$,
      this.selectedDynamics$,
      this.selectedEpisode$,
      this.episodes$
    );

    this.seasonMode$.subscribe((mode) => {
      this.chars$.next(null);
      this.selectedSeason$.next(null);
    });

    this.selectedSeason$.subscribe((season) => {
      this.isLoading$.next(true);
      this.getEpisodes$(season).subscribe((episodes) => {
        this.episodes$.next(episodes);
        if (this.seasonMode$.value) {
          const chars = this.getAllCharsFromSeason(<Episode[]>episodes);
          const uniqueChars = this.unique(chars);
          const charsCount = this.countUnique(chars);
          this.chars$.next(uniqueChars);
          this.charsCount$.next(charsCount);
        }
      });
      this.isLoading$.next(false);
    });
    this.selectedEpisode$.subscribe((episode) => {
      this.chars$.next(null);
      this.chars$.next(episode.chars);
      this.charsCount$.next(this.countUnique(episode.chars));
    });
  }

  getEpisodes$(season: number): Observable<Episode[] | DocumentData[]> {
    return this.db
      .collection(`season_${season}`)
      .get()
      .pipe(
        map((snapshot) => {
          const episodes = snapshot.docs
            .map((doc) => doc.data())
            .sort((a, b) => a.episodeNum - b.episodeNum);
          return episodes;
        })
      );
  }

  getAllCharsFromSeason(episodes: Episode[]) {
    const chars = episodes.map((e) => e.chars).flat(1);
    return chars;
  }

  // Typescript does not support Sets yet, so yeah:
  countUnique(chars: string[]): {} {
    let seen = {};
    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];
      if (seen[char] === undefined) {
        seen[char] = 1;
      } else {
        seen[char] = seen[char] + 1;
      }
    }
    return seen;
  }

  unique(chars: string[]) {
    let out = [];
    let seen = {};
    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];
      if (seen[char] === undefined) {
        seen[char] = 1;
        out.push(char);
      } else {
        seen[char] = seen[char] + 1;
      }
    }
    return out;
  }
}
