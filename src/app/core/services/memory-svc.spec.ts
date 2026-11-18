import { TestBed } from "@angular/core/testing";
import { MemorySvc } from "./memory-svc";

describe("MemorySvc", () => {
  let service: MemorySvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemorySvc);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
