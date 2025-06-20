
export const getPdfPageCount = async (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!window.PDFLib) {
      reject(new Error('PDF processing library (pdf-lib) is not loaded.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        reject(new Error('Failed to read file.'));
        return;
      }
      try {
        const pdfDoc = await window.PDFLib.PDFDocument.load(event.target.result as ArrayBuffer);
        resolve(pdfDoc.getPageCount());
      } catch (error) {
        console.error("Error parsing PDF: ", error);
        reject(new Error('Could not parse PDF. The file might be corrupted or not a valid PDF.'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading file.'));
    };
    reader.readAsArrayBuffer(file);
  });
};
    