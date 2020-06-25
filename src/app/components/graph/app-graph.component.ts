import { CsvDownloadService } from "./../../services/csv-download.service";
import { GraphDataService } from "../../services/graph-data.service";
import { FirebaseDataService } from "./../../services/firebase-data.service";
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { Edge, Node, GraphComponent } from "@swimlane/ngx-graph";
import { Subject, Subscription } from "rxjs";

@Component({
  selector: "app-graph",
  templateUrl: "./app-graph.component.html",
  styleUrls: ["./app-graph.component.scss"],
})
export class AppGraphComponent implements OnInit, OnDestroy {
  @ViewChild(GraphComponent, { static: false }) graphComponent: GraphComponent;

  nodes: Node[];
  links: Edge[];
  graphLinksSubscription: Subscription;
  graphNodesSubscription: Subscription;

  constructor(
    private dataService: FirebaseDataService,
    private graphDataService: GraphDataService,
    private cd: ChangeDetectorRef,
    private csvService: CsvDownloadService
  ) {}

  ngOnInit() {
    this.graphLinksSubscription = this.graphDataService.graphLinks$.subscribe(
      (links: Edge[]) => {
        console.log("AppGraphComponent -> links", links);
        this.links = links;
      }
    );

    this.graphNodesSubscription = this.graphDataService.graphNodes$.subscribe(
      (nodes: Node[]) => {
        console.log("AppGraphComponent -> nodes", nodes);
        this.nodes = nodes;
      }
    );
  }

  ngOnDestroy() {
    this.graphLinksSubscription.unsubscribe();
    this.graphNodesSubscription.unsubscribe();
  }

  draggingEnabled: boolean = true;
  panningEnabled: boolean = true;
  zoomEnabled: boolean = false;

  zoomSpeed: number = 0.1;
  minZoomLevel: number = 0.1;
  maxZoomLevel: number = 4.0;
  panOnZoom: boolean = true;

  autoZoom: boolean = true;
  autoCenter: boolean = false;

  update$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
}
