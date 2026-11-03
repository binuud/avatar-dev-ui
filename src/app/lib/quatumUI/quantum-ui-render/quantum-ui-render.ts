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

  capture() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png');
      console.log(imageDataUrl); // Use or save base64 image data
      this.webCamImageUrl.set(imageDataUrl);
      this.uiSubmitEvent.emit(imageDataUrl);
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
