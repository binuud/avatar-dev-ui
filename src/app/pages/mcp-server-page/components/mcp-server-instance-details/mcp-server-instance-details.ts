import { Component, inject, input, model } from "@angular/core";
import {
  MCPServerInstance,
  MCPTransportType,
} from "../../../../gen/v1/mcpManager/mcpManager.pb";
import { McpToolInteract } from "../mcp-tool-interact/mcp-tool-interact";

@Component({
  imports: [McpToolInteract],
  selector: "app-mcp-server-instance-details",
  styleUrl: "./mcp-server-instance-details.scss",
  templateUrl: "./mcp-server-instance-details.html",
})
export class McpServerInstanceDetails {
  mcpInstance = model.required<MCPServerInstance>();
  showToolForm = input.required<boolean>();

  mcpTypes = MCPTransportType;
}
