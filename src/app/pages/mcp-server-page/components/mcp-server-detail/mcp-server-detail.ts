import { Component, inject, input, signal, WritableSignal } from "@angular/core";
import { GetResponse, MCPServerConfig, MCPServerInstance } from "../../../../gen/v1/mcpManager/mcpManager.pb";
import { McpManagerSrv } from "../../../../core/services/mcp-manager-srv";

@Component({
  imports: [],
  selector: "app-mcp-server-detail",
  styleUrl: "./mcp-server-detail.scss",
  templateUrl: "./mcp-server-detail.html",
})

export class McpServerDetail {

  mcpConfig = input.required<MCPServerConfig>();
  mcpManagerSvc = inject(McpManagerSrv);

  mcpInstance:  WritableSignal<MCPServerInstance> = signal({})

  get(uuid: string | undefined) {
    if (uuid) {
      this.mcpManagerSvc.get({uuid: uuid}).then(response => {
        if (response && response.instance) {
          this.mcpInstance.set(response.instance);
        }
      });
    }
  }

}
