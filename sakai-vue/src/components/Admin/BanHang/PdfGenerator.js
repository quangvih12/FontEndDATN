import html2pdf from 'html2pdf.js';
export default function usePdfGenerator() {
    const generatePdf = async (htmlContent, filename = 'document') => {
        const pdfOptions = {
            margin: 30,
            filename: `${filename}.pdf`,
            image: { type: 'png', quality: 2 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        try {
            const pdf = await html2pdf(htmlContent).from(htmlContent).set(pdfOptions).save();

            // You can save the generated PDF or perform other actions here
            // For example, you can open the PDF in a new tab:
            const blob = new Blob([pdf], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return { generatePdf };
}