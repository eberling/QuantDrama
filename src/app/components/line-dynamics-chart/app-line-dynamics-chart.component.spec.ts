import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppLineDynamicsChartComponent } from "./app-line-dynamics-chart.component";

describe("LineDynamicsChartComponent", () => {
  let component: AppLineDynamicsChartComponent;
  let fixture: ComponentFixture<AppLineDynamicsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppLineDynamicsChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLineDynamicsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
