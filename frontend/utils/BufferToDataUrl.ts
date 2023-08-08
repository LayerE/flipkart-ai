export const  arrayBufferToDataURL =  (buffer: ArrayBuffer): string  =>{
  const blob = new Blob([buffer], { type: 'image/png' });
  return URL.createObjectURL(blob);
  }

 export async function dataURLtoFile(dataURL: string, filename: string):Promise<File>{
    const response = await fetch(dataURL);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
  }