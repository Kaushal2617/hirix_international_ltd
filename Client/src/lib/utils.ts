import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function validateImageDimensions(file: File, minWidth: number, minHeight: number): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.width >= minWidth && img.height >= minHeight);
      };
      img.onerror = () => resolve(false);
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}