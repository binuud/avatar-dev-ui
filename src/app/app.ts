import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SideBarMenu } from './layout/side-bar-menu/side-bar-menu';
import { TopMainNav } from './layout/top-main-nav/top-main-nav';


@Component({
  imports: [RouterOutlet, SideBarMenu, TopMainNav],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('avatar-dev-ui');
}
