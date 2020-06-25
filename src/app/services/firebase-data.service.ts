import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Observable, Subject, of, BehaviorSubject } from "rxjs";
import { Episode } from "src/analysis/interface-show";
import { AngularFirestore, DocumentData } from "angularfire2/firestore";

@Injectable({
  providedIn: "root",
})
export class FirebaseDataService {
  seasons$: Observable<number[]>;
  episodes$: Subject<Episode[] | DocumentData[]> = new Subject();
  chars$: Subject<string[]> = new Subject();
  charsCount$: Subject<[string, number][]> = new Subject();

  selectedChars$: Subject<string[]> = new Subject();
  selectedEpisode$: Subject<Episode> = new Subject();
  selectedDynamics$: Subject<string[]> = new Subject();
  selectedSeason$: Subject<number> = new Subject();

  graphData$: Subject<any>;
  graphFormData$: Observable<any>;

  episodeDensity: number;

  seasonMode$ = new BehaviorSubject(null);
  isLoading$ = new BehaviorSubject(false);

  constructor(private db: AngularFirestore) {
    this.seasons$ = of([1, 2, 3, 4, 5, 6, 7]);

    this.seasonMode$.subscribe((mode) => {
      this.chars$.next(null);
      this.selectedSeason$.next(null);
    });

    this.selectedSeason$.subscribe((season) => {
      this.isLoading$.next(true);
      this.getEpisodes$(season).subscribe((episodes) => {
        this.episodes$.next(episodes);
        if (this.seasonMode$.value) {
          const allChars = this.getAllCharsFromSeason(<Episode[]>episodes);
          const charsCounted = this.countAndSliceAndSortChars(allChars);
          const chars = charsCounted.map((charArr) => charArr[0]);
          this.chars$.next(chars);
          this.charsCount$.next(charsCounted);
        }
      });
      this.isLoading$.next(false);
    });
    this.selectedEpisode$.subscribe((episode) => {
      this.selectedChars$.next(null);
      this.chars$.next(null);
      this.chars$.next(episode.chars);
      this.charsCount$.next(this.countAndSliceAndSortChars(episode.chars));
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
    const chars = episodes
      .map((e) => e.chars)
      .reduce((a, b) => {
        return a.concat(b);
      }, []);
    return chars;
  }

  // Typescript does not support Sets yet, so here is SO deduping:
  countAndSliceAndSortChars(chars: string[]): [string, number][] {
    let seen = {};
    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];
      if (seen[char] === undefined) {
        seen[char] = 1;
      } else {
        seen[char] = seen[char] + 1;
      }
    }
    const entries: [string, number][] = Object.entries(seen);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const sliced = sorted.slice(0, 10);
    return sliced;
  }
}
