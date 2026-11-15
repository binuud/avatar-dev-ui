import { Component,computed,effect,inject, input, OnDestroy, Signal, signal, WritableSignal } from "@angular/core";

import { AvatarSrv } from "../../../core/services/avatar-srv";
import { ActivatedRoute } from "@angular/router";
import { QuantumUiRender } from "../../quatumUI/quantum-ui-render/quantum-ui-render";
import { MarkdownModule } from "ngx-markdown";
import { AvatarStatusIcon } from "../../../shared/ui/avatar-status-icon/avatar-status-icon";
import { ControlRequest } from "../../../gen/v1/avatar/avatarService.pb";
import { QuantumUI, UiComponent } from "../../../gen/v1/quantumUI/quantumUI.pb";
import { AvatarAction, AvatarControl, AvatarResult, AvatarStatus, StepStatusResponseType } from "../../../gen/v1/avatar/avatarControl.pb";

declare var bootstrap: any; 

const RUNNING_STATUSES: string[] = [AvatarStatus.STATUS_ACTIVE, AvatarStatus.STATUS_INIT];

@Component({
  imports: [QuantumUiRender, MarkdownModule, AvatarStatusIcon],
  selector: "app-avatar-run",
  styleUrl: "./avatar-run.scss",
  templateUrl: "./avatar-run.html",
})
export class AvatarRun implements OnDestroy {
  
  private route = inject(ActivatedRoute);
  avatarSvc = inject(AvatarSrv)

  id = input.required<string>(); 
  showDetails = input<boolean>(false);

  statusEnum = AvatarStatus;
  actionEnum = AvatarAction;
  resultEnum = AvatarResult;

  name: string = "";

  showDebug: WritableSignal<boolean> = signal(false);

  isConnectionLost: Signal<boolean> = computed(() => {
    console.log("Checking if connection lost");
    const connected = this.avatarSvc.isConnected();
    const status = this.avatarSvc.avatarControl().control?.status;
    // if we have a valid avatar status (which means the avatar was started)
    // and connection is down, it means the connection was lost in middle
    if (status && !connected) {
      if (RUNNING_STATUSES.includes(status)) {
        return true;
      } else {
        return false;
      }
    } 
    return false;
  });

  currentUiComponent: Signal<QuantumUI | undefined> = computed(() => {
    const currentStep = this.avatarSvc.currentStep();
    return this.getUiComponentById(currentStep);
  });

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
   * ngOnDestroy
   * close the websocket
   * #TBD this needs revisit, where user can go away from screen and return back
   */
  ngOnDestroy(): void {
    this.avatarSvc.close();
  }

  /**
   * list()
   * get list of avatars from server
   */ 
  async get() {
    this.avatarSvc.get(this.name);
  }

  connectAndStart() {
    this.avatarSvc.avatarControl.set({});
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
   * getUiComponentById
   * avatar runner, sends the ui component id, to be rendered to the user in the current running step
   * @param currentStep 
   * @returns QuantumUI with matching name as selected by llm
   */
  getUiComponentById(currentStep: number): QuantumUI | undefined {
    
    if (currentStep == -1) return undefined;

    const uiArray = this.avatarSvc.avatar().uiCollection?.ui;
    const currentStepObj = this.avatarSvc.avatarControl()?.control;

    // now get the ui-component-id 
    if (currentStepObj?.stepStatuses && uiArray) {
      const componentId = currentStepObj?.stepStatuses[currentStep].response;
      console.log("Trying to open ui component with id "+componentId);
      const targetComponent = uiArray.find(item => item.name === componentId); 
      return targetComponent;
    }
    return undefined
  }

  reRunStep(stepNum: number) {
    // now send this back to avatar
    console.log("Trying to rerun step " + stepNum);
    let req: ControlRequest = {
      "control": structuredClone(this.avatarSvc.avatarControl().control),
    }
    
    if (req.control) {
      if (req.control.stepStatuses && req.control.stepStatuses[stepNum]) {
        req.control.stepStatuses[stepNum].status = AvatarStatus.STATUS_IGNORE;
        // check if data is image data
      }
      req.control.currentStep = stepNum;
      req.control.action = AvatarAction.ACTION_BEGIN;
      this.avatarSvc.sendControl(req);
      console.log("Sent continue control request to avatar")
    }

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
    console.dir(data.slice(0, 100));
    
    let currentStep = this.avatarSvc.avatarControl().control?.currentStep || 0;
    // now send this back to avatar
    let req: ControlRequest = {
      "control": structuredClone(this.avatarSvc.avatarControl().control),
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
        req.control.stepStatuses[currentStep].status = AvatarStatus.STATUS_COMPLETED;
        req.control.stepStatuses[currentStep].result = AvatarResult.RESULT_SUCCESS;
      }
      req.control.currentStep = currentStep;
      req.control.action = AvatarAction.ACTION_BEGIN;
      this.avatarSvc.sendControl(req);
      console.log("Sent continue control request to avatar")
    }

  }
}
