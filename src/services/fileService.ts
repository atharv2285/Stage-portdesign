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
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
             fileType === 'application/vnd.ms-powerpoint') {
    // For PPT/PPTX, generate a placeholder preview
    preview = await generatePptPlaceholder(fileName);
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    textContent = await extractDocText(file);
    // For DOCX, generate a placeholder preview
    preview = await generateDocPlaceholder(fileName);
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
    console.log('Extracting PDF first page for:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    console.log('PDF loaded, pages:', pdf.numPages);
    if (pdf.numPages === 0) {
      console.warn('PDF has 0 pages');
      return '';
    }
    
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 }); // Increased scale for better quality
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Could not get canvas context');
      return '';
    }
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    console.log('Rendering PDF page, size:', canvas.width, 'x', canvas.height);
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    };
    
    await page.render(renderContext as any).promise;
    
    const dataUrl = canvas.toDataURL('image/png');
    console.log('PDF first page extracted successfully, data URL length:', dataUrl.length);
    return dataUrl;
  } catch (error) {
    console.error('Error extracting PDF first page:', error);
    return generateErrorPlaceholder('PDF Preview Unavailable', '#ef4444');
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

async function generatePptPlaceholder(fileName: string): Promise<string> {
  console.log('Generating PowerPoint preview for:', fileName);
  // Note: Extracting actual PPT slides requires complex rendering
  // This creates a professional placeholder until proper extraction is implemented
  return generateErrorPlaceholder(`PowerPoint: ${fileName}`, '#4f46e5');
}

async function generateDocPlaceholder(fileName: string): Promise<string> {
  console.log('Generating Document preview for:', fileName);
  return generateErrorPlaceholder(`Document: ${fileName}`, '#2563eb');
}

function generateErrorPlaceholder(text: string, color: string): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  canvas.width = 800;
  canvas.height = 600;
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, adjustColor(color, -20));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Icon placeholder
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(250, 150, 300, 300);
  
  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  ctx.font = '16px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('Preview will appear here', canvas.width / 2, canvas.height / 2 + 40);
  
  return canvas.toDataURL('image/png');
}

function adjustColor(color: string, amount: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
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
