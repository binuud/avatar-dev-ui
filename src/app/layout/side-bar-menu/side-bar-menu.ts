import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-bar-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive,],
  templateUrl: './side-bar-menu.html',
  styleUrl: './side-bar-menu.scss'
})
export class SideBarMenu {

  loading: boolean | undefined;

  constructor () {

  }

  ngOnInit(): void {

  }


}
