import { Component } from "@angular/core";
import { McpServerList } from "./components/mcp-server-list/mcp-server-list";

@Component({
  imports: [McpServerList],
  selector: "app-mcp-server-page",
  styleUrl: "./mcp-server-page.scss",
  templateUrl: "./mcp-server-page.html",
})

export class McpServerPage {}
