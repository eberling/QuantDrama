import { map } from "rxjs/operators";
import { GraphDataService } from "../../services/graph-data.service";
import { FirebaseDataService } from "./../../services/firebase-data.service";
import {
  Component,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from "@angular/core";
import * as shape from "d3-shape";
import { Edge, Node, ClusterNode, Layout } from "@swimlane/ngx-graph";
import { nodes, clusters, links } from "../../exampleData";
import { Subject } from "rxjs";

@Component({
  selector: "app-graph",
  templateUrl: "./app-graph.component.html",
  styleUrls: ["./app-graph.component.scss"],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppGraphComponent implements OnInit {
  constructor(
    private dataService: FirebaseDataService,
    private analysisService: GraphDataService
  ) {
    this.links$ = this.analysisService.graphLinks$.pipe(
      map((links: any[]) => {
        let flattened = links.reduce((acc, curr) => acc.concat(curr));
        console.log("AppGraphComponent -> links", flattened);
        this.links = flattened;
        return flattened;
      })
    );
    // this.analysisService.graphNodes$.subscribe((nodes: any[]) => {
    //   console.log("AppGraphComponent -> nodes", nodes);
    //   this.nodes = nodes;
    // });
    this.nodes$ = this.analysisService.graphNodes$.pipe(
      map((nodes: any[]) => {
        console.log("AppGraphComponent -> nodes", nodes);
        this.nodes = nodes;
        return nodes;
      })
    );
    this.nodes$.subscribe();
    this.links$.subscribe();
  }

  nodes: Node[];
  links: Edge[];
  links$;
  nodes$;

  // line interpolation
  // curveType: string = "Bundle";
  // curve: any = shape.curveLinear;
  // interpolationTypes = [
  //   "Bundle",
  //   "Cardinal",
  //   "Catmull Rom",
  //   "Linear",
  //   "Monotone X",
  //   "Monotone Y",
  //   "Natural",
  //   "Step",
  //   "Step After",
  //   "Step Before",
  // ];

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
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();

  ngOnInit() {
    console.log("skooba", this.nodes);
    // this.setInterpolationType(this.curveType);
  }

  // setInterpolationType(curveType) {
  //   this.curveType = curveType;
  //   if (curveType === "Bundle") {
  //     this.curve = shape.curveBundle.beta(1);
  //   }
  //   if (curveType === "Cardinal") {
  //     this.curve = shape.curveCardinal;
  //   }
  //   if (curveType === "Catmull Rom") {
  //     this.curve = shape.curveCatmullRom;
  //   }
  //   if (curveType === "Linear") {
  //     this.curve = shape.curveLinear;
  //   }
  //   if (curveType === "Monotone X") {
  //     this.curve = shape.curveMonotoneX;
  //   }
  //   if (curveType === "Monotone Y") {
  //     this.curve = shape.curveMonotoneY;
  //   }
  //   if (curveType === "Natural") {
  //     this.curve = shape.curveNatural;
  //   }
  //   if (curveType === "Step") {
  //     this.curve = shape.curveStep;
  //   }
  //   if (curveType === "Step After") {
  //     this.curve = shape.curveStepAfter;
  //   }
  //   if (curveType === "Step Before") {
  //     this.curve = shape.curveStepBefore;
  //   }
  // }
}
