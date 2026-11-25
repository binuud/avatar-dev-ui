import { ComponentFixture, TestBed } from "@angular/core/testing";
import { McpToolInteract } from "./mcp-tool-interact";

describe("McpToolInteract", () => {
  let component: McpToolInteract;
  let fixture: ComponentFixture<McpToolInteract>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McpToolInteract],
    }).compileComponents();

    fixture = TestBed.createComponent(McpToolInteract);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
