import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const useDownloadPDF = () => {
  const downloadPDF = async (elementId: string, fileName = 'document.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      return;
    }

    document.body.classList.add('pdf-mode');

    await new Promise((r) => setTimeout(r, 100));

    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      try {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add remaining pages
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const base64 = pdf.output('datauristring').split(',')[1];

        await Filesystem.writeFile({
          path: fileName,
          data: base64,
          directory: Directory.Documents,
        });

        const fileUri = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Documents,
        });

        await Share.share({
          title: 'Download PDF',
          text: 'Download or share your PDF',
          url: fileUri.uri,
          dialogTitle: 'Share your PDF',
        });
      } catch (err) {
        console.error('PDF export failed on native platform:', err);
      }
    } else {
      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: 0.5,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };

      html2pdf().set(opt).from(element).save();
    }

    setTimeout(() => {
      document.body.classList.remove('pdf-mode');
    }, 500);
  };

  return { downloadPDF };
};
