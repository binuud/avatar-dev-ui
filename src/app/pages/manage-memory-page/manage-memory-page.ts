import { Component, inject } from "@angular/core";
import { MemorySvc } from "../../core/services/memory-svc";
import { MemoryDetails } from "./components/memory-details/memory-details";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  imports: [MemoryDetails, RouterLink, RouterLinkActive],
  selector: "app-manage-memory-page",
  styleUrl: "./manage-memory-page.scss",
  templateUrl: "./manage-memory-page.html",
})
export class ManageMemoryPage {
  
  memorySvc = inject(MemorySvc);

  constructor() {

    this.memorySvc.list({});

  }

}
