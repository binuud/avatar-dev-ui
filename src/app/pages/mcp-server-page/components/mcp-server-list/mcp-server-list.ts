import { Component, inject } from "@angular/core";
import { McpManagerSrv } from "../../../../core/services/mcp-manager-srv";
import { McpServerDetail } from "../mcp-server-detail/mcp-server-detail";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  imports: [McpServerDetail, RouterLink, RouterLinkActive],
  selector: "app-mcp-server-list",
  styleUrl: "./mcp-server-list.scss",
  templateUrl: "./mcp-server-list.html",
})

export class McpServerList {

  mcpManagerSvc = inject(McpManagerSrv);

  constructor() {

    this.mcpManagerSvc.list({});

  }


}
