import { Component, inject } from "@angular/core";
import { MemorySvc } from "../../core/services/memory-svc";
import { MemoryDetails } from "./components/memory-details/memory-details";

@Component({
  imports: [MemoryDetails],
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
