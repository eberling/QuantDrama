import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MatrixTableComponent } from "./app-matrix-table.component";

describe("MatrixTableComponent", () => {
  let component: MatrixTableComponent;
  let fixture: ComponentFixture<MatrixTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MatrixTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
