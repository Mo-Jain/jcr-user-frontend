// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';
// import { Filesystem, Directory } from '@capacitor/filesystem';
// import { Share } from '@capacitor/share';
// import { Capacitor } from '@capacitor/core';

export const useDownloadPDF = () => {
  const downloadPDF = async (elementId: string, fileName = 'document.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      return;
    }

    document.body.classList.add('pdf-mode');

    await new Promise((r) => setTimeout(r, 100));

    // const isNative = Capacitor.isNativePlatform();

    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 0.5,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();

    setTimeout(() => {
      document.body.classList.remove('pdf-mode');
    }, 500);
  };

  return { downloadPDF };
};
