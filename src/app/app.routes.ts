import { Routes } from "@angular/router";
import { AiChatPage } from "./pages/ai-chat-page/ai-chat-page";
import { HomePage } from "./pages/home-page/home-page";
import { AvatarPage } from "./pages/avatar-page/avatar-page";
import { AvatarRun } from "./lib/avatar/avatar-run/avatar-run";
import { SettingsPage } from "./pages/settings-page/settings-page";
import { AvatarDetails } from "./lib/avatar/avatar-details/avatar-details";
import { McpServerPage } from "./pages/mcp-server-page/mcp-server-page";
import { AddMcpServer } from "./pages/mcp-server-page/components/add-mcp-server/add-mcp-server";
import { ManageMemoryPage } from "./pages/manage-memory-page/manage-memory-page";
import { EditMemorySettings } from "./pages/manage-memory-page/components/edit-memory-settings/edit-memory-settings";
import { WelcomePage } from "./pages/welcome-page/welcome-page";

export const routes: Routes = [
  { path: "", redirectTo: "/welcome", pathMatch: "full" },
  { path: "welcome", component: WelcomePage },
  { path: "home", component: HomePage },
  { path: "chat", component: AiChatPage },
  { path: "avatars", component: AvatarPage },
  { path: "mcpServers", component: McpServerPage },
  { path: "mcpServers/new", component: AddMcpServer },
  { path: "avatarDetails/:id", component: AvatarDetails },
  { path: "avatar/:id", component: AvatarRun },
  { path: "memory", component: ManageMemoryPage },
  { path: "memory/:action/:id", component: EditMemorySettings },
  { path: "settings", component: SettingsPage },
];
