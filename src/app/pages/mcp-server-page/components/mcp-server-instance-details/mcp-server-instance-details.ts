import { Component, input } from "@angular/core";
import { MCPServerInstance, MCPTransportType } from "../../../../gen/v1/mcpManager/mcpManager.pb";
import { JsonSchemaRender } from "../../../../lib/quatumUI/json-schema-render/json-schema-render";

@Component({
  imports: [JsonSchemaRender],
  selector: "app-mcp-server-instance-details",
  styleUrl: "./mcp-server-instance-details.scss",
  templateUrl: "./mcp-server-instance-details.html",
})
export class McpServerInstanceDetails {
  
  mcpInstance = input.required<MCPServerInstance>();
  
  mcpTypes = MCPTransportType;

  submit($event: string) {
    console.log($event)
  }
  
}
