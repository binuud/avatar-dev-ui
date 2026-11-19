import { Component, inject, input, signal, WritableSignal } from "@angular/core";
import { MemorySvc } from "../../../../core/services/memory-svc";
import { MemoryMeta } from "../../../../gen/v1/conscious/memory.pb";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ConsciousService } from "../../../../core/services/conscious-service";
import { ToastSrv } from "../../../../core/services/toast-srv";

@Component({
  imports: [FormsModule],
  selector: "app-edit-memory-settings",
  styleUrl: "./edit-memory-settings.scss",
  templateUrl: "./edit-memory-settings.html",
})

export class EditMemorySettings {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  aiSvc = inject(ConsciousService);
  memorySvc = inject(MemorySvc);
  toastService = inject(ToastSrv);
  
  memoryMeta: WritableSignal<MemoryMeta> = signal({})
  action: WritableSignal<string> = signal("")
  name: string = "";


  constructor() {
    const param = this.route.snapshot.paramMap.get('id');
    const action = this.route.snapshot.paramMap.get('action');
    if (action) {
      this.action.set(action);
    }
    
    console.log(param);
    console.log(action);
    this.name = "";
    if (param) {
      this.name = param;
    }
    // if name is emtpy load emtpy memory, if not load existing memory
    this.memorySvc.getMemoryMeta({name: this.name}).then((response) =>{
      console.dir(response);
      if (response && response.meta) {
        this.memoryMeta.set(response.meta)
      }
      
    });
  }

  save() {
    if (this.action() == "edit") {
      this.memorySvc.update({meta: this.memoryMeta()}).then(()=>{
        this.toastService.notifySuccess("save memory details");
        this.router.navigate(['/memory']);
      });
    } else {
      this.memorySvc.add({meta: this.memoryMeta()}).then(()=>{
        this.toastService.notifySuccess("save memory details");
        this.router.navigate(['/memory']);
      });      
    }

  }

}
