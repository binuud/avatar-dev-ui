import { Component, inject, signal, WritableSignal } from "@angular/core";
import { McpManagerSrv } from "../../../../core/services/mcp-manager-srv";
import { CheckRequest, MCPServerConfig, MCPServerInstance, MCPTransportType, RegisterRequest } from "../../../../gen/v1/mcpManager/mcpManager.pb";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastSrv } from "../../../../core/services/toast-srv";
import { McpServerInstanceDetails } from "../mcp-server-instance-details/mcp-server-instance-details";

@Component({
  imports: [FormsModule, McpServerInstanceDetails],
  selector: "app-add-mcp-server",
  styleUrl: "./add-mcp-server.scss",
  templateUrl: "./add-mcp-server.html",
})

export class AddMcpServer {
  
  mcpManagerSvc = inject(McpManagerSrv);
  router = inject(Router);
  toastService = inject(ToastSrv);
  
  data:  WritableSignal<MCPServerConfig> = signal({})
  mcpInstance:  WritableSignal<MCPServerInstance> = signal({})
  
  mcpTypes = MCPTransportType;

  validateData(): boolean {
    if (this.data().mcpType == this.mcpTypes.MCP_TYPE_STDIO) {
      this.data().uuid = "";
    } else {
      this.data().command = "";
    }
    if (this.data().command === "" && this.data().url === "") {
      return false;
    }
    return true;
  }

  check() {
    console.log("validation " + this.validateData());
    if (!this.validateData()) {
      this.toastService.notifyError("data validation failed");
      return;
    }

    const req: CheckRequest = {
      config: this.data()
    }
    
    this.mcpManagerSvc.check(req).then(response => {
      if (response && response.instance) {
        this.mcpInstance.set(response.instance);
      }
      this.toastService.notifySuccess("checked successfully");
    }).catch(error => {
      this.toastService.notifyError(error['message']);
    });

  }

  submit() {

    if (!this.validateData()) {
      this.toastService.notifyError("data validation failed");
      return;
    }

    const req: RegisterRequest = {
      config: this.data()
    }
    
    this.mcpManagerSvc.save(req).then(response => {
      if (response && response.instance) {
        this.mcpInstance.set(response.instance);
      }
      this.toastService.notifySuccess("MCP Server is registered");
      this.router.navigate(['/mcpServers']);
    }).catch(error => {
      this.toastService.notifyError(error['message']);
    });
  }

}
