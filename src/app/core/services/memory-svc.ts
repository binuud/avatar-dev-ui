import { Service, signal, WritableSignal } from "@angular/core";
import {
  AddMemoryRequest,
  AddMemoryResponse,
  ClearMemoryRequest,
  ClearMemoryResponse,
  DeleteMemoryRequest,
  GetMemoryMetaRequest,
  GetMemoryMetaResponse,
  GetMemoryRequest,
  GetMemoryResponse,
  ListMemoryRequest,
  ListMemoryResponse,
  UpdateMemoryRequest,
  UpdateMemoryResponse,
} from "../../gen/v1/conscious/memory.pb";
import { MemoryService } from "../../gen/v1/conscious/memoryService.pb";
import { InitReq } from "../../gen/fetch.pb";

@Service()
export class MemorySvc {
  memories: WritableSignal<ListMemoryResponse> = signal({});

  initReq: InitReq = {
    pathPrefix: "/api",
  };

  /**
   * list
   * @param req
   * gets the list of memory
   */
  list(req: ListMemoryRequest) {
    MemoryService.List(req, this.initReq).then((response) => {
      this.memories.set(response);
      console.dir(response);
    });
  }

  /**
   * get
   * @param req
   * gets the memory meta object
   */
  async getMemoryMeta(
    req: GetMemoryMetaRequest,
  ): Promise<GetMemoryMetaResponse | void> {
    return MemoryService.GetMemoryMeta(req, this.initReq);
  }

  /**
   * get
   * @param req
   * gets the full memory object
   */
  async get(req: GetMemoryRequest): Promise<GetMemoryResponse | void> {
    return MemoryService.Get(req, this.initReq);
  }

  /**
   * add
   * @param req
   * creates a new memory session
   */
  add(req: AddMemoryRequest): Promise<AddMemoryResponse | void> {
    return MemoryService.Add(req, this.initReq).then((response) => {
      console.dir(response);
    });
  }

  /**
   * update
   * @param req
   * updates the memory
   */
  update(req: UpdateMemoryRequest): Promise<UpdateMemoryResponse | void> {
    return MemoryService.Update(req, this.initReq).then((response) => {
      console.dir(response);
    });
  }

  /**
   * delete
   * @param req
   * delete the memory
   */
  delete(req: DeleteMemoryRequest) {
    MemoryService.Delete(req, this.initReq).then((response) => {
      this.list({});
    });
  }

  /**
   * clear
   * @param req
   * clears the memory context, keeping the meta information intact
   */
  clear(req: ClearMemoryRequest): Promise<ClearMemoryResponse | void> {
    return MemoryService.ClearMemory(req, this.initReq);
  }
}
