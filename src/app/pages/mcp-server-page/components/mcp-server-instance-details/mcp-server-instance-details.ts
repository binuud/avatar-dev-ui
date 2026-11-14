import { Component, inject, input, model } from "@angular/core";
import { MCPServerInstance, MCPTransportType } from "../../../../gen/v1/mcpManager/mcpManager.pb";
import { JsonSchemaRender } from "../../../../lib/quatumUI/json-schema-render/json-schema-render";
import { McpManagerSrv } from "../../../../core/services/mcp-manager-srv";
import { ToastSrv } from "../../../../core/services/toast-srv";
import { JsonPipe } from "@angular/common";

@Component({
  imports: [JsonSchemaRender, JsonPipe],
  selector: "app-mcp-server-instance-details",
  styleUrl: "./mcp-server-instance-details.scss",
  templateUrl: "./mcp-server-instance-details.html",
})
export class McpServerInstanceDetails {
  
  toastService = inject(ToastSrv);
  mcpManagerSvc = inject(McpManagerSrv);
  mcpInstance = model.required<MCPServerInstance>();
  showToolForm = input.required<boolean>();
  
  mcpTypes = MCPTransportType;

  submit(toolIndex: number, toolName: string, inputData: string) {
      this.mcpManagerSvc.handleTool({
        uuid: this.mcpInstance().config?.uuid,
        name: this.mcpInstance().config?.name,
        toolName: toolName,
        inputData: inputData
      }).then(response => {

      let tools = this.mcpInstance().tools;
      if (tools && tools[toolIndex] && response.output) {
        tools[toolIndex].response = response.output;
        this.mcpInstance.update(current => ({
          ...current,
          tools: tools
        }));
      }
      console.log(response);
    }).catch(error => {
      this.toastService.notifyError(error['message']);
    })
    console.log(inputData)
  }
  
}
