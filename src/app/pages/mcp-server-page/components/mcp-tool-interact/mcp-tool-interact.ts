import {
  Component,
  inject,
  input,
  model,
  signal,
  WritableSignal,
} from "@angular/core";
import { LanguagePipe, MarkdownModule } from "ngx-markdown";
import {
  MCPServerInstance,
  MCPTool,
} from "../../../../gen/v1/mcpManager/mcpManager.pb";
import { JsonSchemaRender } from "../../../../lib/quatumUI/json-schema-render/json-schema-render";
import { JsonPipe } from "@angular/common";
import { McpManagerSrv } from "../../../../core/services/mcp-manager-srv";
import { ToastSrv } from "../../../../core/services/toast-srv";

@Component({
  imports: [JsonSchemaRender, JsonPipe, MarkdownModule, LanguagePipe],
  selector: "app-mcp-tool-interact",
  styleUrl: "./mcp-tool-interact.scss",
  templateUrl: "./mcp-tool-interact.html",
})
export class McpToolInteract {
  mcpManagerSvc = inject(McpManagerSrv);
  toastService = inject(ToastSrv);

  tool = input.required<MCPTool>();
  mcpInstance = model.required<MCPServerInstance>();
  toolIndex = input.required<number>();

  toolResponse: WritableSignal<string> = signal("");

  getJson(rawResponse: string): any {
    try {
      const data = JSON.parse(rawResponse);
      console.dir(data);
      return data;
    } catch (err) {
      console.error(`cannot parse tool response to json ${err}`);
      return rawResponse;
    }
  }

  submit(toolIndex: number, toolName: string, inputData: string) {
    this.mcpManagerSvc
      .handleTool({
        uuid: this.mcpInstance().config?.uuid,
        name: this.mcpInstance().config?.name,
        toolName: toolName,
        inputData: inputData,
      })
      .then((response) => {
        let data = response.output;
        if (response.output) {
          try {
            data = JSON.parse(response.output);
            console.dir(data);
          } catch (err) {
            console.error(`cannot parse tool response to json ${err}`);
          }
        }
        if (data) {
          this.toolResponse.set(data);
        }
      })
      .catch((error) => {
        this.toastService.notifyError(error["message"]);
      });
    console.log(inputData);
  }
}
