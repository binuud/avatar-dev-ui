import { DestroyRef, inject, Service, signal, WritableSignal } from "@angular/core";
import { GetSystemMetricsRequest, Metrics, SystemMetrics } from "../../gen/v1/conscious/metrics.pb";
import { InitReq } from "../../gen/fetch.pb";

@Service()
export class SystemMetricsService {

  metrics: WritableSignal<SystemMetrics> = signal({});
  isAvailable: WritableSignal<boolean> = signal(false);

  private activeMetricsStream: any = null; 
  initReq: InitReq = {
      pathPrefix: "/api"
  }

  constructor() {
    this.streamMetrics();
  }

  async streamMetrics()  {

    const req: GetSystemMetricsRequest = {}
    try {
      this.activeMetricsStream =  Metrics.GetSystemMetrics(req, this.metricsStreamCallback, this.initReq).then(() => {
        // Stream completed successfully
        console.log("then: metrics server closed connection");
        this.isAvailable.set(false);
      }).catch((error) => {
        // Handle stream errors
        console.log("error: metrics server closed connection");
        console.error(error);
        this.isAvailable.set(false);
      });
    } catch(error) {
      console.log("try error: metrics server closed connection");
      console.error(error);
    } finally {
      console.log("finally: metrics server closed connection");
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
    this.isAvailable.set(true);
    this.metrics.set(resp);
  };

  closeMetricsStream() {
    if (this.activeMetricsStream) {
      // Check for common termination methods used by streaming SDKs
      if (typeof this.activeMetricsStream.cancel === 'function') {
        this.activeMetricsStream.cancel();
      } else if (typeof this.activeMetricsStream.close === 'function') {
        this.activeMetricsStream.close();
      }
    }
    this.activeMetricsStream = null;
    this.isAvailable.set(false);
    console.log("Client explicitly closed the metrics stream.");
  }

}
