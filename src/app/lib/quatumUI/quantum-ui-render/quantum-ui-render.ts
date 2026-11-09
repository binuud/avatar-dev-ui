import { AfterViewInit, Component, ElementRef, inject, input, OnDestroy, OnInit, output, signal, ViewChild, WritableSignal } from "@angular/core";
import { QuantumUI, UiComponentUiType } from "../../../gen/v1/quantumUI/quantumUI.pb";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";


@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: "app-quantum-ui-render",
  styleUrl: "./quantum-ui-render.scss",
  templateUrl: "./quantum-ui-render.html",
})
export class QuantumUiRender implements OnInit, AfterViewInit, OnDestroy {

  fb = inject(FormBuilder);

  ui = input.required<QuantumUI>();
  uiSubmitEvent = output<string>(); 

  dynamicForm: FormGroup = new FormGroup({});

  componentTypes = UiComponentUiType;

  isWebCamNeeded : WritableSignal<boolean> = signal(false);
  webCamImageUrl : WritableSignal<string> = signal("");

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  private stream?: MediaStream;

  /**
   * ngAfterViewInit
   * if web cam needs to be rendered by the ui, then
   * enable webcam and get the media url
   * this prevents browser asking for web cam permission needlessly
   */
  async ngAfterViewInit() {
    if (this.isWebCamNeeded()) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.videoElement.nativeElement.srcObject = this.stream;
      } catch (err) {
        console.error('Camera access denied or unavailable:', err);
      }
    }
  }

  trimImageToSquare(img: HTMLVideoElement): Promise<string> {
    return new Promise((resolve, reject) => {

      const size = Math.min(img.width, img.height);
      const startX = (img.width - size) / 2;
      const startY = (img.height - size) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject('Canvas context not available');
      }

    });
  }

  /**
   * capture()
   * captures the web camera
   * crops the sides to make the image squarish
   * and sends the same to backend avatar process
   */
  capture() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      this.trimImageToSquare(video).then((imageDataUrl)=>{
        this.webCamImageUrl.set(imageDataUrl);
        this.uiSubmitEvent.emit(imageDataUrl);
        console.log("Image resized");
      }).catch(error => {
        console.error("cannot resize image "+ error)
      })

      // context.drawImage(video, 0, 0, canvas.width, canvas.height);
      // const imageDataUrl = canvas.toDataURL('image/png');
      // console.log(imageDataUrl); // Use or save base64 image data
      // this.webCamImageUrl.set(imageDataUrl);
      // this.uiSubmitEvent.emit(imageDataUrl);
    }
  }

  ngOnDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  ngOnInit(): void {
    // Initialize form controls based on the config array
    let components = this.ui().components;
    if (!components) return;
    // let myForm: FormGroup =  new FormGroup({});
    components.forEach(item => {
      if (item.id) {
        if (item.type == "WEBCAM") {
          this.isWebCamNeeded.set(true);
        }
        this.dynamicForm.setControl(item.id, new FormControl('', [Validators.required]));
      }
    });
  }

  selectImage(imageItem: string) {
    const data = {
      'select-dress': imageItem
    }
    const jsonOutput = JSON.stringify(data, null, 2);
    this.uiSubmitEvent.emit(jsonOutput);
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      const data = this.dynamicForm.value;
      // console.log('Form Submitted:', data);
      const rawFormValues = this.dynamicForm.getRawValue();
      // Convert the JavaScript object into a clean, formatted JSON string
      const jsonOutput = JSON.stringify(rawFormValues, null, 2);
      this.uiSubmitEvent.emit(jsonOutput);
    }
  }



}
