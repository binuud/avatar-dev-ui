import { Service, signal, WritableSignal } from "@angular/core";
import { Conscious } from "../../gen/v1/conscious/consciousService.pb";
import { GetSystemMetricsRequest, Metrics, SystemMetrics } from "../../gen/v1/conscious/metrics.pb";
import { InitReq } from "../../gen/fetch.pb";

@Service()
export class SystemMetricsService {

  initReq: InitReq = {
      pathPrefix: "/api"
  }

  metrics: WritableSignal<SystemMetrics> = signal({});

  async streamMetrics()  {
    const req: GetSystemMetricsRequest = {}
    try {
      await Metrics.GetSystemMetrics(req, this.metricsStreamCallback, this.initReq);
    } catch (error) {
      alert(error);
      console.log("metrics server closed connection");
      console.error(error);
      
    } finally {
      console.log("metrics server closed connection");
    }
  }

  /**
   * metricsStreamCallback()
   * callback function, for streaming llm chat completions
   * when streaming call is done, this callback needs to be called
   * to update the ui
   * @param resp 
   */  
  metricsStreamCallback = (resp: SystemMetrics) => {
    // Append the newly arrived word to our signal string instantly
    this.metrics.set(resp);
  };

}
