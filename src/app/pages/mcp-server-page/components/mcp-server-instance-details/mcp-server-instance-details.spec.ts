import { ComponentFixture, TestBed } from "@angular/core/testing";
import { McpServerInstanceDetails } from "./mcp-server-instance-details";

describe("McpServerInstanceDetails", () => {
  let component: McpServerInstanceDetails;
  let fixture: ComponentFixture<McpServerInstanceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McpServerInstanceDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(McpServerInstanceDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
