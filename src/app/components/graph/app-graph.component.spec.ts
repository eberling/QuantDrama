import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppGraphComponent } from "./app-graph.component";

describe("GraphComponent", () => {
  let component: AppGraphComponent;
  let fixture: ComponentFixture<AppGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppGraphComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
