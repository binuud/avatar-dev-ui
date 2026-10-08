import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ChatResponse } from "./chat-response";

describe("ChatResponse", () => {
  let component: ChatResponse;
  let fixture: ComponentFixture<ChatResponse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatResponse],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatResponse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
