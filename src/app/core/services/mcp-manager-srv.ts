import { Service, signal, WritableSignal } from "@angular/core";
import { CheckRequest, CheckResponse, GetRequest, HandleToolRequest, ListRequest, ListResponse, MCPManagerService, MCPServerConfig, RegisterRequest, ToggleRequest } from "../../gen/v1/mcpManager/mcpManager.pb";
import { InitReq } from "../../gen/fetch.pb";

@Service()
export class McpManagerSrv {

  mcpServers: WritableSignal<ListResponse> = signal({})


  initReq: InitReq = {
      pathPrefix: "/api"
  }

  constructor() {
    this.list({});
  }

  /**
   * list
   * @param req 
   * gets the list of mcp servers
   */
  list(req: ListRequest) {
    
    MCPManagerService.List(req, this.initReq).then(response => {
      this.mcpServers.set(response);
      console.dir(response);
    });

  }

  /**
   * get
   * @param req 
   * check the status of the registered server
   */
  get(req: GetRequest) {
    
    return MCPManagerService.Get(req, this.initReq);

  }

  /**
   * toggle
   * @param req 
   * check the status of the registered server
   */
  toggle(req: ToggleRequest) {
    
    return MCPManagerService.Toggle(req, this.initReq);

  }

  /**
   * check
   * @param req 
   * check the status of server without adding
   */
  check(req: CheckRequest) {
    
    return MCPManagerService.Check(req, this.initReq);

  }

  /**
   * check
   * @param req 
   * check the status of server without adding
   */
  handleTool(req: HandleToolRequest) {
    
    return MCPManagerService.HandleTool(req, this.initReq);

  }

  /**
   * save
   * @param req 
   * save the mcp server
   */
  save(req: RegisterRequest) {
    
    return MCPManagerService.Register(req, this.initReq);

  }


}
