import { Service } from "@angular/core";
import { Conscious } from "../../gen/v1/conscious/consciousService.pb";
import { GetSystemMetricsRequest, Metrics, SystemMetrics } from "../../gen/v1/conscious/metrics.pb";
import { InitReq } from "../../gen/fetch.pb";

@Service()
export class SystemMetricsService {

  initReq: InitReq = {
      pathPrefix: "/api"
  }

  streamMetrics(myCallback: (resp: SystemMetrics) => void) {
    const req: GetSystemMetricsRequest = {}
    return Metrics.GetSystemMetrics(req, myCallback, this.initReq);
  }

}
