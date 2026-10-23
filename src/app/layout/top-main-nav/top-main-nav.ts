import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-top-main-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-main-nav.html',
  styleUrl: './top-main-nav.scss'
})
export class TopMainNav {

  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;
  
}
