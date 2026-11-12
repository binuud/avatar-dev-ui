import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddMcpServer } from "./add-mcp-server";

describe("AddMcpServer", () => {
  let component: AddMcpServer;
  let fixture: ComponentFixture<AddMcpServer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMcpServer],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMcpServer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
