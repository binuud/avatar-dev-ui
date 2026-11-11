import { TestBed } from "@angular/core/testing";
import { McpManagerSrv } from "./mcp-manager-srv";

describe("McpManagerSrv", () => {
  let service: McpManagerSrv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(McpManagerSrv);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
