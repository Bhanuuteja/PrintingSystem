export enum AppStep {
  INITIAL_CHECK,
  WAITING,
  UPLOAD,
  CONFIRM_DETAILS,
  PAYMENT,
  PRINTING,
  THANK_YOU,
}

export type Orientation = 'portrait' | 'landscape';
export type ColorMode = 'black-and-white' | 'color';
export type DuplexMode = 'single-sided' | 'double-sided-long-edge' | 'double-sided-short-edge';

export interface PrintJob {
  file: File;
  fileName: string;
  pageCount: number;
  cost: number;
  copies: number;
  orientation: Orientation;
  colorMode: ColorMode;
  duplexMode: DuplexMode;
}

// Ensure window.PDFLib is recognized by TypeScript
declare global {
  interface Window {
    PDFLib: any; 
  }
}