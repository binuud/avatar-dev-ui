import { Component, computed, input } from "@angular/core";
import { MarkdownModule } from "ngx-markdown";
import { SingleContext } from "../../../gen/v1/conscious/memory.pb";
import { CopyToClipboard } from "../../../core/directives/copy-to-clipboard";


@Component({
  imports: [MarkdownModule, CopyToClipboard],
  selector: "app-chat-response",
  styleUrl: "./chat-response.scss",
  templateUrl: "./chat-response.html",
})
export class ChatResponse {
  context = input.required<SingleContext>();
  type = input.required<'HISTORY' | 'ACTIVE'>();

  staticFile = computed(() => {
    const file =this.context().out?.responseImage;
    if (file) {
      return this.getImagePath(file);
    }
    return "";
  } );


  getTimeElapsed(): number {
    let s1 = Number(this.context().out?.createdAt?.seconds);
    let s2 = Number(this.context().out?.completedAt?.seconds);
    return (s2-s1);
  }

  getImagePath(file: string): string {
    if (file == "") return "";
    if (!file.startsWith("/")) {
      file = "/" + file;
    }
    if (!file.startsWith("/static")) {
      file = "/static" + file;
    }
    return file
  }

}
