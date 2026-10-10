import { TestBed } from "@angular/core/testing";
import { ConsciousService } from "./conscious-service";

describe("ConsciousService", () => {
  let service: ConsciousService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsciousService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
