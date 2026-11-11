import { Service, signal, WritableSignal } from "@angular/core";
import { CheckRequest, CheckResponse, GetRequest, ListRequest, ListResponse, MCPManagerService, MCPServerConfig } from "../../gen/v1/mcpManager/mcpManager.pb";
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
   * list
   * @param req 
   * check the status of server without adding
   */
  check(req: CheckRequest) {
    
    // MCPManagerService.Check(req, this.initReq).then(response => {
    //   this.mcpServers.set(response);
    //   console.dir(response);
    // });

  }

  /**
   * get
   * @param req 
   * check the status of the registered server
   */
  get(req: GetRequest) {
    
    return MCPManagerService.Get(req, this.initReq);

  }
}
