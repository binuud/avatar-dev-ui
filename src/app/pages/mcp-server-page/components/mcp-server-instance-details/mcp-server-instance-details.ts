import { Component, input } from "@angular/core";
import { MCPServerInstance, MCPTransportType } from "../../../../gen/v1/mcpManager/mcpManager.pb";

@Component({
  imports: [],
  selector: "app-mcp-server-instance-details",
  styleUrl: "./mcp-server-instance-details.scss",
  templateUrl: "./mcp-server-instance-details.html",
})
export class McpServerInstanceDetails {
  
  mcpInstance = input.required<MCPServerInstance>();
  
  mcpTypes = MCPTransportType;
  
}
