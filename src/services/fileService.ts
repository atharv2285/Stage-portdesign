import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface FileUploadResult {
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileData: string;
  preview?: string;
  textContent?: string;
}

export async function handleFileUpload(file: File): Promise<FileUploadResult> {
  const fileData = await fileToBase64(file);
  const fileType = file.type;
  const fileName = file.name;
  
  let preview: string | undefined;
  let textContent: string | undefined;

  if (fileType === 'application/pdf') {
    preview = await extractPdfFirstPage(file);
    textContent = await extractPdfText(file);
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    textContent = await extractDocText(file);
  } else if (fileType.startsWith('image/')) {
    preview = fileData;
  }

  return {
    fileName,
    fileType,
    fileUrl: fileData,
    fileData,
    preview,
    textContent
  };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function extractPdfFirstPage(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    if (pdf.numPages === 0) return '';
    
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return '';
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    };
    
    await page.render(renderContext as any).promise;
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error extracting PDF first page:', error);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    canvas.width = 800;
    canvas.height = 600;
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6b7280';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PDF Preview Unavailable', canvas.width / 2, canvas.height / 2);
    
    return canvas.toDataURL('image/png');
  }
}

async function extractPdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    let text = '';
    for (let i = 0; i < Math.min(pages.length, 5); i++) {
      const page = pages[i];
      text += `Page ${i + 1}\n`;
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return '';
  }
}

async function extractDocText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting DOC text:', error);
    return '';
  }
}

export function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
