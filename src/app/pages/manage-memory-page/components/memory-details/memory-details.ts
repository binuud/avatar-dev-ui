import { Component, inject, input } from "@angular/core";
import { MemorySvc } from "../../../../core/services/memory-svc";
import { MemoryMeta } from "../../../../gen/v1/conscious/memory.pb";
import { RouterLink } from "@angular/router";

@Component({
  imports: [RouterLink],
  selector: "app-memory-details",
  styleUrl: "./memory-details.scss",
  templateUrl: "./memory-details.html",
})
export class MemoryDetails {
  memorySvc = inject(MemorySvc);
  memoryMeta = input.required<MemoryMeta>();
}
