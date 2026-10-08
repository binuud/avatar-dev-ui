import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConnectionErrorMessage } from "./connection-error-message";

describe("ConnectionErrorMessage", () => {
  let component: ConnectionErrorMessage;
  let fixture: ComponentFixture<ConnectionErrorMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionErrorMessage],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionErrorMessage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
