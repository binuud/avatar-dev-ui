import {
  DestroyRef,
  effect,
  inject,
  Service,
  signal,
  WritableSignal,
} from "@angular/core";
import {
  GetSystemMetricsRequest,
  Metrics,
  SystemMetrics,
} from "../../gen/v1/conscious/metrics.pb";
import { InitReq } from "../../gen/fetch.pb";

@Service()
export class SystemMetricsService {
  // number of seconds to wait, since last event to abort connection
  static INACTIVITY_TIMEOUT = 30000;
  // number of seconds to wait, before retrying connection
  static RETRY_DELAY = 10000;
  metrics: WritableSignal<SystemMetrics> = signal({});
  isAvailable: WritableSignal<boolean> = signal(false);

  private activeMetricsStream: any = null;

  controller: AbortController | null = null;

  initReq: InitReq = {};

  retryCounter = 0;
  watchdogTimer: ReturnType<typeof setTimeout> | null = null;
  isManuallyClosed = false;

  constructor() {
    this.reloadMetrics();
  }

  reloadMetrics() {
    // for simple backoff
    // do no increase beyond 5 minutes.
    if (this.retryCounter < 30) {
      this.retryCounter++;
    }
    this.clearWatchdog();
    setTimeout(() => {
      this.streamMetrics();
    }, SystemMetricsService.RETRY_DELAY * this.retryCounter);
  }

  clearWatchdog() {
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }

  // Resets the countdown; aborts the fetch if triggered
  resetWatchdogTimer() {
    this.clearWatchdog();
    this.retryCounter = 0;
    this.watchdogTimer = setTimeout(() => {
      console.warn(
        `No SSE data received for ${SystemMetricsService.INACTIVITY_TIMEOUT}ms. Restarting...`,
      );
      this.controller?.abort("INACTIVITY_TIMEOUT");
    }, SystemMetricsService.INACTIVITY_TIMEOUT);
  }

  async streamMetrics() {
    this.resetWatchdogTimer();
    this.controller = new AbortController();
    this.initReq = {
      pathPrefix: "/api",
      signal: this.controller.signal,
    };

    const req: GetSystemMetricsRequest = {};
    try {
      this.activeMetricsStream = Metrics.GetSystemMetrics(
        req,
        this.metricsStreamCallback,
        this.initReq,
      )
        .then(() => {
          // Stream completed successfully
          console.log("then: metrics server closed connection");
          this.isAvailable.set(false);
        })
        .catch((error) => {
          // Handle stream errors
          this.clearWatchdog();
          console.log("error: metrics server closed connection");
          console.error(error);
          this.isAvailable.set(false);
          // metrics server closed, server side crashed or went away
          // try reconnecting
          this.reloadMetrics();
        });
    } catch (error) {
      console.log("try error: metrics server closed connection");
      console.error(error);
    } finally {
      console.log("finally: triggered on metrics server connection");
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
    this.resetWatchdogTimer(); // reset the watchdog timer
  };

  closeMetricsStream() {
    if (this.activeMetricsStream) {
      // Check for common termination methods used by streaming SDKs
      if (typeof this.activeMetricsStream.cancel === "function") {
        this.activeMetricsStream.cancel();
      } else if (typeof this.activeMetricsStream.close === "function") {
        this.activeMetricsStream.close();
      }
    }
    this.activeMetricsStream = null;
    this.isAvailable.set(false);
    console.log("Client explicitly closed the metrics stream.");
  }
}
