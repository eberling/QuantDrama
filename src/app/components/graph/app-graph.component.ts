import { GraphDataService } from "../../services/graph-data.service";
import { FirebaseDataService } from "./../../services/firebase-data.service";
import { Component, Input } from "@angular/core";
import { Edge, Node } from "@swimlane/ngx-graph";
import { Subject } from "rxjs";

@Component({
  selector: "app-graph",
  templateUrl: "./app-graph.component.html",
  styleUrls: ["./app-graph.component.scss"],
})
export class AppGraphComponent {
  nodes: Node[];
  links: Edge[];

  constructor(
    private dataService: FirebaseDataService,
    private graphDataService: GraphDataService
  ) {
    this.graphDataService.graphLinks$.subscribe((links: Edge[]) => {
      console.log("AppGraphComponent -> links", links);
      this.links = links;
    });
    this.graphDataService.graphNodes$.subscribe((nodes: Node[]) => {
      console.log("AppGraphComponent -> nodes", nodes);
      this.nodes = nodes;
    });
  }

  draggingEnabled: boolean = true;
  panningEnabled: boolean = true;
  zoomEnabled: boolean = false;

  zoomSpeed: number = 0.1;
  minZoomLevel: number = 0.1;
  maxZoomLevel: number = 8.0;
  panOnZoom: boolean = true;

  autoZoom: boolean = true;
  autoCenter: boolean = false;

  update$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();
}
