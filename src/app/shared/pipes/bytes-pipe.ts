import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "bytes",
})

export class BytesPipe implements PipeTransform {
  private readonly units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];

  transform(bytes: number | string | null | undefined, decimals: number = 2): string {
    // Handle null, undefined, or empty values gracefully
    if (bytes === null || bytes === undefined || bytes === '') return '0 B';

    const parsedBytes = typeof bytes === 'string' ? parseFloat(bytes) : bytes;

    // Check if the input is a valid finite number
    if (isNaN(parsedBytes) || !isFinite(parsedBytes) || parsedBytes < 0) {
      return '0 B';
    }

    if (parsedBytes === 0) return '0 B';

    // Calculate the correct unit index based on powers of 1024
    const i = Math.floor(Math.log(parsedBytes) / Math.log(1024));
    
    // Fallback if the file size exceeds the known units array
    const unitIndex = Math.min(i, this.units.length - 1);
    
    const value = parsedBytes / Math.pow(1024, unitIndex);

    // Don't show decimal points for raw bytes (B)
    const formattedDecimals = unitIndex === 0 ? 0 : decimals;

    return `${value.toFixed(formattedDecimals)} ${this.units[unitIndex]}`;
  }
}
