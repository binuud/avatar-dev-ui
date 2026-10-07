import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ChatPromptInput } from "./chat-prompt-input";

describe("ChatPromptInput", () => {
  let component: ChatPromptInput;
  let fixture: ComponentFixture<ChatPromptInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPromptInput],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatPromptInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
