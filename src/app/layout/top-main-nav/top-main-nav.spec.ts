import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMainNav } from './top-main-nav';

describe('TopMainNav', () => {
  let component: TopMainNav;
  let fixture: ComponentFixture<TopMainNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopMainNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopMainNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
