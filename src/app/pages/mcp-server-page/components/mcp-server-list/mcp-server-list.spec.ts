import { ComponentFixture, TestBed } from "@angular/core/testing";
import { McpServerList } from "./mcp-server-list";

describe("McpServerList", () => {
  let component: McpServerList;
  let fixture: ComponentFixture<McpServerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McpServerList],
    }).compileComponents();

    fixture = TestBed.createComponent(McpServerList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
