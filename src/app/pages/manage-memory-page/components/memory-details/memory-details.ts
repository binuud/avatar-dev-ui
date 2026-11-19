import { Component, inject, input } from "@angular/core";
import { MemorySvc } from "../../../../core/services/memory-svc";
import { MemoryMeta } from "../../../../gen/v1/conscious/memory.pb";
import { Router, RouterLink } from "@angular/router";
import { ConsciousService } from "../../../../core/services/conscious-service";
import { ToastSrv } from "../../../../core/services/toast-srv";

@Component({
  imports: [RouterLink],
  selector: "app-memory-details",
  styleUrl: "./memory-details.scss",
  templateUrl: "./memory-details.html",
})

export class MemoryDetails {
  memorySvc = inject(MemorySvc);
  memoryMeta = input.required<MemoryMeta>();
  aiSvc = inject(ConsciousService);
  toastService = inject(ToastSrv);
  private router = inject(Router);
  
  loadMemory(name: string | void) {
    if (!name) return;
    this.memorySvc.get({name: name}).then((response)=>{
      if (response && response.memory) {
        this.aiSvc.setMemory(response.memory);
        this.toastService.notifySuccess(`switched memory to ${name}`);      
        this.router.navigate(['/chat']);
      }
    });

  }
}
