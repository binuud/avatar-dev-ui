import { Component, inject, output, signal } from "@angular/core";
import { ConsciousService } from "../../../core/services/conscious-service";
import { UploadRequest } from "../../../gen/v1/conscious/contextMessage.pb";

@Component({
  imports: [],
  selector: "app-file-upload",
  styleUrl: "./file-upload.scss",
  templateUrl: "./file-upload.html",
})
export class FileUpload {
  // Dependency injection using inject()
  aiSvc = inject(ConsciousService);

  readonly fileUploadedEvent = output<string>(); 

  // Signals to hold state reactively
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  uploadStatus = signal<string>('');

  // Handle the file selection event
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile.set(file);

      // Generate a preview using FileReader
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Upload the file to the backend
  onUpload(): void {
    const file = this.selectedFile();
    if (!file) {
      this.uploadStatus.set('Please select a file first.');
      return;
    }

    const reader = new FileReader();
    
    // 1. Convert the file stream to a DataURL (Base64 wrapper string)
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      const req : UploadRequest = {
        fileData: base64Data,
        fileName: file.name,
        contentType: ""
      };
      this.uploadStatus.set('Uploading...');
      try {
        this.aiSvc.uploadFile(req).then(response=>{
          console.log("File uploaded ")
          console.dir(response);
          if (response.uploadId) {
            this.fileUploadedEvent.emit(response.uploadId);
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.uploadStatus.set('File uploaded.');
      }

    }


    
  }
}
