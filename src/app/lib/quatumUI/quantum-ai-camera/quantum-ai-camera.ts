import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnInit,
  ViewChild,
} from "@angular/core";

@Component({
  imports: [],
  selector: "app-quantum-ai-camera",
  styleUrl: "./quantum-ai-camera.scss",
  templateUrl: "./quantum-ai-camera.html",
})
export class QuantumAiCamera implements OnInit, AfterViewInit {
  @ViewChild("webCam") webCamRef!: ElementRef<HTMLVideoElement>;
  @ViewChild("webCamCanvas") webCamCanvasRef!: ElementRef<HTMLCanvasElement>;

  width = input<number>(160);
  height = input<number>(120);

  private ctx!: CanvasRenderingContext2D;
  private stream?: MediaStream;

  ngOnInit(): void {
    console.log(`^^ ngOnInit (${this.width}x${this.height}) `);
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

    this.drawTest();
  }

  // sendImage is a test function to check
  // yolo, by sending an static image via broker (through websocket)
  sendImage() {
    // URL of the image to load
    const imageUrl = "/yoloQuery.jpg";

    // Fetch the image as Blob and convert to Base64 string
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(",")[1];
          // Publish Base64 image string to MQTT topic
          this.sendImageToBroker(base64data);
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        console.error("Error loading or sending image:", err);
      });
  }

  async sendImageToBroker(base64data: string) {
    // uuid is used to track the chat entity,
    // the event from websocket, will container the same uuid
    // this enables, the UI to show the output with the correct question
    // const req: GenerateRequest = {
    //   name: "Vision", // stop gap till we have seperate type
    //   uuid: uuidv4(),
    //   prompt: base64data,
    // };
    // // console.log("Processing yolo " + req.uuid)
    // const jsonString = JSON.stringify(req);
    // this.consciousSvc.sendMessage(jsonString);

    return null;
  }

  // drawTest() tests the canvas by drawing a blue circle and a rectanglw
  drawTest() {
    this.ctx.beginPath();
    this.ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.clearRect(0, 0, this.width(), this.height());
    this.ctx.strokeStyle = "blue";
    this.ctx.strokeRect(50, 50, 100, 100);

    this.ctx.beginPath();
    this.ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
}
