import { TestBed } from "@angular/core/testing";
import { SystemMetricsService } from "./system-metrics-service";

describe("SystemMetricsService", () => {
  let service: SystemMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemMetricsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
