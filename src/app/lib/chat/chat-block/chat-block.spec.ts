import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ChatBlock } from "./chat-block";

describe("ChatBlock", () => {
  let component: ChatBlock;
  let fixture: ComponentFixture<ChatBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
