import { ComponentFixture, TestBed } from "@angular/core/testing";
import { McpServerDetail } from "./mcp-server-detail";

describe("McpServerDetail", () => {
  let component: McpServerDetail;
  let fixture: ComponentFixture<McpServerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McpServerDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(McpServerDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
