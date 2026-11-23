import { TestBed } from "@angular/core/testing";
import { SensorEventsSvc } from "./sensor-events-svc";

describe("SensorEventsSvc", () => {
  let service: SensorEventsSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorEventsSvc);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
