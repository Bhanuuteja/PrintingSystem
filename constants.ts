import { Orientation, ColorMode, DuplexMode } from './types';

export const PRICE_PER_PAGE: number = 1; // 1 Rupee per page

// These are now primarily used by the apiService.ts to simulate backend behavior
export const PRINTER_BUSY_DURATION_MS: number = 5 * 60 * 1000; // 5 minutes
export const LOCAL_STORAGE_PRINTER_BUSY_KEY: string = 'printerBusyUntilTimestamp'; // Made more specific

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const DEFAULT_COPIES: number = 1;
export const DEFAULT_ORIENTATION: Orientation = 'portrait';
export const DEFAULT_COLOR_MODE: ColorMode = 'black-and-white';
export const DEFAULT_DUPLEX_MODE: DuplexMode = 'single-sided';
