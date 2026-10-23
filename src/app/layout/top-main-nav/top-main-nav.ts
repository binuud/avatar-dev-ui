import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Tooltip } from '../../core/directives/tooltip';

@Component({
  selector: 'app-top-main-nav',
  imports: [Tooltip, RouterLink, RouterLinkActive],
  templateUrl: './top-main-nav.html',
  styleUrl: './top-main-nav.scss'
})
export class TopMainNav {

  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;
  
}
