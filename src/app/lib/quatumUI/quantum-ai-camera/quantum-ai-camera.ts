import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  ViewChild,
} from "@angular/core";
import {
  ContextMesssage,
  ContextMesssageContextType,
} from "../../../gen/v1/conscious/contextMessage.pb";
import { Detection, YoloResponse } from "../../../core/models/ai-interfaces";
import { SensorEventsSvc } from "../../../core/services/sensor-events-svc";

@Component({
  imports: [],
  selector: "app-quantum-ai-camera",
  styleUrl: "./quantum-ai-camera.scss",
  templateUrl: "./quantum-ai-camera.html",
})
export class QuantumAiCamera implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("webCam") webCamRef!: ElementRef<HTMLVideoElement>;
  @ViewChild("webCamCanvas") webCamCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild("webOverlayCanvas")
  webOverlayCanvasRef!: ElementRef<HTMLCanvasElement>;

  aiEventsSvc = inject(SensorEventsSvc);

  width = input<number>(160);
  height = input<number>(120);

  onEvent = output<ContextMesssage>();

  private ctx!: CanvasRenderingContext2D;
  private overlayCtx!: CanvasRenderingContext2D;
  private stream?: MediaStream;

  private captureInterval: any;
  detections = computed<Detection | null>(() => {
    return null;
  });

  constructor() {
    effect(() => {
      const eventData = this.aiEventsSvc.sensorEvent();
      console.log("Detections fired");
      if (!eventData || !eventData.response) {
        return;
      }

      if ((eventData.type = ContextMesssageContextType.OBJECT_DETECTION)) {
        const response: YoloResponse = JSON.parse(eventData.response);
        console.dir(response);
        console.log("objects identified");
        this.drawMirroredBoxes(response.detections, false, true);
      }
    });
  }

  ngOnInit(): void {
    console.log(`^^ ngOnInit (${this.width}x${this.height}) `);
    // rerun the detect frame sequence after 300ms
    setTimeout(() => {
      this.captureInterval = setInterval(() => {
        this.sendImage();
      }, 1000);
    }, 5000);
  }

  ngOnDestroy() {
    // clear the detectFrame interval
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
    }
  }

  async ngAfterViewInit() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      this.webCamRef.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error("Camera access denied or unavailable:", err);
    }
    const canvas = this.webCamCanvasRef.nativeElement;
    this.ctx = canvas.getContext("2d")!;

    const overlayCanvas = this.webOverlayCanvasRef.nativeElement;
    this.overlayCtx = overlayCanvas.getContext("2d")!;

    this.drawTest();
  }

  // handleImage captured webcam image
  // converts video from web cam to canvas, to get the framedata
  // converts framedata to jpg with compression, and sends same to mqtt broker
  // yolo backend service can then subscribe on the image topic, to do parsing.
  sendImage(): void {
    const video = this.webCamRef.nativeElement;
    // const canvas = this.webCamCanvasRef.nativeElement;
    // if (!canvas || !video) return;
    // canvas.width = video.videoWidth || this.width();
    // canvas.height = video.videoHeight || this.height();
    // console.log(`Canvas ${this.width}x${this.height} :: Video ${video.videoWidth}x${video.videoHeight}`)

    // const ctx = canvas.getContext("2d");

    // Flip horizontally (mirror effect)
    this.ctx.translate(this.ctx.canvas.width, 0);
    this.ctx.scale(-1, 1);
    this.ctx?.drawImage(
      video,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );
    // Reset transformation matrix for future captures
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Convert canvas frame to compressed JPEG base64 string
    const frameData = this.ctx.canvas.toDataURL("image/jpeg", 0.6);
    const base64data = (frameData as string).split(",")[1];
    // Publish Base64 image string to MQTT topic
    this.onEvent.emit({
      prompt: base64data,
      type: ContextMesssageContextType.OBJECT_DETECTION,
    });
  }

  // drawTest() tests the canvas by drawing a blue circle and a rectanglw
  drawTest() {
    this.overlayCtx.beginPath();
    this.overlayCtx.arc(95, 50, 40, 0, 2 * Math.PI);
    this.overlayCtx.stroke();

    this.overlayCtx.clearRect(0, 0, this.width(), this.height());
    this.overlayCtx.strokeStyle = "blue";
    this.overlayCtx.strokeRect(50, 50, 100, 100);

    this.overlayCtx.beginPath();
    this.overlayCtx.arc(95, 50, 40, 0, 2 * Math.PI);
    this.overlayCtx.stroke();
  }

  // detections are multiple object and face detections found by facereco or yolo
  // clear is used to clear the old boxes, which are drawn for displaying detections
  drawMirroredBoxes(
    detections: Detection[],
    mirrored: boolean,
    clear: boolean,
  ) {
    const ctx = this.overlayCtx;
    const canvasWidth = this.width();

    if (clear) {
      ctx.clearRect(0, 0, this.width(), this.height());
    }

    ctx.lineWidth = 2;
    ctx.font = "16px Arial";
    ctx.textBaseline = "top";

    for (const detection of detections) {
      let [x1, y1, x2, y2] = detection.box_xyxy;

      // Mirror horizontally (flip X axis)
      let mirroredX1 = x1;
      let mirroredX2 = x2;
      if (mirrored) {
        mirroredX1 = this.width() - x2;
        mirroredX2 = this.width() - x1;
      }

      const width = Math.abs(x1 - x2);
      const height = y2 - y1;

      // Draw bounding box
      ctx.strokeStyle = "red";
      ctx.strokeRect(mirroredX1, y1, width, height);

      // Draw label background
      const label = `${detection.label} (${(detection.confidence * 100).toFixed(1)}%)`;
      const textWidth = ctx.measureText(label).width;
      const textHeight = 18;
      ctx.fillStyle = "red";
      ctx.fillRect(mirroredX1, y1 - textHeight, textWidth + 4, textHeight);

      // Draw label text
      ctx.fillStyle = "white";
      ctx.fillText(label, mirroredX1 + 2, y1 - textHeight + 2);
    }
  }
}
