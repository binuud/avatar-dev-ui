import { Component,effect,inject, input } from "@angular/core";
import { AvatarControl, AvatarControlAvatarAction, AvatarStatus, StepStatusResponseType } from "../../../gen/v1/avatar/avatar.pb";
import { AvatarSrv } from "../../../core/services/avatar-srv";
import { ActivatedRoute } from "@angular/router";
import { QuantumUiRender } from "../../quatumUI/quantum-ui-render/quantum-ui-render";
import { MarkdownModule } from "ngx-markdown";
import { AvatarStatusIcon } from "../../../shared/ui/avatar-status-icon/avatar-status-icon";
import { ControlRequest } from "../../../gen/v1/avatar/avatarService.pb";

declare var bootstrap: any; 



@Component({
  imports: [QuantumUiRender, MarkdownModule, AvatarStatusIcon],
  selector: "app-avatar-run",
  styleUrl: "./avatar-run.scss",
  templateUrl: "./avatar-run.html",
})
export class AvatarRun {
  
  private route = inject(ActivatedRoute);
  avatarSvc = inject(AvatarSrv)

  id = input.required<string>(); 
  showDetails = input<boolean>(false);

  name: string = "";

  constructor() {
    const param = this.route.snapshot.paramMap.get('id')
    if (param) {
      this.name = param;
      this.get();

      // reset the avatar control status
      this.avatarSvc.avatarControl.set({});
    }
  }

  /**
   * list()
   * get list of avatars from server
   */ 
  async get() {
    this.avatarSvc.get(this.name);
  }

  connectAndStart() {
    if (this.avatarSvc.isConnected()) {
      this.avatarSvc.sendInit();
    } else {
      // connect first and then start
      this.avatarSvc.connect();
    }
  }

  getTimeElapsed(control: AvatarControl): number {
    let s1 = Number(control.createdAt?.seconds);
    let s2 = Number(control.completedAt?.seconds);
    return (s2-s1);
  }

  isImageDataURL(str: string) {
    if (typeof str !== 'string') return false;
    
    // Matches "data:image/ANY_TYPE;base64,DATA" or "data:image/ANY_TYPE,DATA"
    const regex = /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/;
    
    return regex.test(str);
  }


  /**
   * uiFormEvent
   * @param data 
   * on getting json data from the form
   * send it back to the avatar server using the control structure
   * set the response in step status array
   */
  uiFormEvent(data: string) {
    console.log("got data from form")
    console.dir(data);
    
    let currentStep = this.avatarSvc.avatarControl().control?.currentStep || 0;
    // now send this back to avatar
    let req: ControlRequest = {
      "control": this.avatarSvc.avatarControl().control,
    }



    if (req.control) {
      if (req.control.stepStatuses && req.control.stepStatuses[currentStep]) {
        // check if data is image data
        if (this.isImageDataURL(data)) {
          req.control.stepStatuses[currentStep].responseType = StepStatusResponseType.IMAGEDATA;
        } else {
          req.control.stepStatuses[currentStep].responseType = StepStatusResponseType.TEXT;
        }
         req.control.stepStatuses[currentStep].response = data;
        req.control.stepStatuses[currentStep].status = AvatarStatus.STATUS_SUCCESS
      }
      req.control.currentStep = currentStep;
      req.control.action = AvatarControlAvatarAction.RUN;
      this.avatarSvc.sendControl(req);
      console.log("Sent continue control request to avatar")
    }

  }
}
