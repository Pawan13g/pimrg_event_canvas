import { type ClassValue, clsx } from "clsx"
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertFilesToBase64Array(imageFiles: FileList | null, callback: any) {
  const base64Array: any = [];

  const reader = new FileReader();

  function readNext(index: any) {

    if (imageFiles) {
      if (index >= imageFiles.length) {
        // All images are processed, call the callback with the base64Array
        callback(base64Array);
        return;
      }

      const file = imageFiles[index];

      reader.onload = function (event) {
        const base64String = event?.target?.result;
        base64Array.push({ name: file.name, url: base64String });

        // Continue processing the next image
        readNext(index + 1);
      };

      // Read the current image as a data URL
      reader.readAsDataURL(file);
    }

  }

  // Start processing the first image
  readNext(0);
}

export function purifyString(str: string) { return str.replace(/[^a-zA-Z0-9]/g, "_") }


export function paramsToString(data: any) {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return ret.join('&');
}

export function formatTime(time: Date) { return dayjs(time.toISOString()).format('hh:mm A') }