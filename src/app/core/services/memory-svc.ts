import { Service, signal, WritableSignal } from "@angular/core";
import { AddMemoryRequest, DeleteMemoryRequest, GetMemoryRequest, GetMemoryResponse, ListMemoryRequest, ListMemoryResponse, UpdateMemoryRequest, UpdateMemoryResponse } from "../../gen/v1/conscious/memory.pb";
import { MemoryService } from "../../gen/v1/conscious/memoryService.pb";
import { InitReq } from "../../gen/fetch.pb";

@Service()
export class MemorySvc {

  memories: WritableSignal<ListMemoryResponse> = signal({})

  initReq: InitReq = {
      pathPrefix: "/api"
  }

  /**
   * list
   * @param req 
   * gets the list of memory
   */
  list(req: ListMemoryRequest) {
    
    MemoryService.List(req, this.initReq).then(response => {
      this.memories.set(response);
      console.dir(response);
    });

  }

  /**
   * get
   * @param req 
   * gets the memory
   */
  async get(req: GetMemoryRequest): Promise<GetMemoryResponse | void> {
    
    return MemoryService.Get(req, this.initReq);

  }

  /**
   * add
   * @param req 
   * creates a new memory session
   */
  add(req: AddMemoryRequest) {
    
    MemoryService.Add(req, this.initReq).then(response => {
      console.dir(response);
    });

  }
  
  /**
   * update
   * @param req 
   * updates the memory
   */
  update(req: UpdateMemoryRequest): Promise<UpdateMemoryResponse | void> {
    
    return MemoryService.Update(req, this.initReq).then(response => {
      console.dir(response);
    });

  }  

  /**
   * delete
   * @param req 
   * delete the memory
   */
  delete(req: DeleteMemoryRequest) {
    
    MemoryService.Delete(req, this.initReq).then(response => {
      console.dir(response);
    });

  }

}
