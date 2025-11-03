export interface ImageFile {
  file: File;
  base64: string;
  mimeType: string;
}

export interface EditOptions {
  style: string | null;
  lighting: string | null;
  composition: string | null;
}