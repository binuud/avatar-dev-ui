import { ComponentFixture, TestBed } from "@angular/core/testing";
import { McpServerPage } from "./mcp-server-page";

describe("McpServerPage", () => {
  let component: McpServerPage;
  let fixture: ComponentFixture<McpServerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McpServerPage],
    }).compileComponents();

    fixture = TestBed.createComponent(McpServerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
