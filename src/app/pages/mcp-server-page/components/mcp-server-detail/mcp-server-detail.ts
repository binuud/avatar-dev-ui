import { Component, inject, input, signal, WritableSignal } from "@angular/core";
import { MCPServerConfig, MCPServerInstance } from "../../../../gen/v1/mcpManager/mcpManager.pb";
import { McpManagerSrv } from "../../../../core/services/mcp-manager-srv";
import { MarkdownModule } from "ngx-markdown";
import { McpServerInstanceDetails } from "../mcp-server-instance-details/mcp-server-instance-details";
import { ActionButton } from "../../../../core/components/action-button/action-button";
import { GetResponse } from "../../../../gen/v1/avatar/avatarService.pb";


@Component({
  imports: [ActionButton, MarkdownModule, McpServerInstanceDetails],
  selector: "app-mcp-server-detail",
  styleUrl: "./mcp-server-detail.scss",
  templateUrl: "./mcp-server-detail.html",
})

export class McpServerDetail {

  mcpConfig = input.required<MCPServerConfig>();
  mcpManagerSvc = inject(McpManagerSrv);

  mcpInstance:  WritableSignal<MCPServerInstance> = signal({})

  async get(uuid: string | undefined): Promise<void | GetResponse> {
    if (uuid) {
      return this.mcpManagerSvc.get({uuid: uuid}).then(response => {
        if (response && response.instance) {
          this.mcpInstance.set(response.instance);
        }
      });
    }
  }

}
