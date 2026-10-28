/**
 * PDF to Image Converter Utility for SmartGrade
 * Uses Mozilla's PDF.js to render PDF pages into clean JPEG images
 * directly in the browser. These images can be visually inspected
 * and sent to Groq Multimodal Vision AI.
 */

export async function convertPdfToImages(file, maxPages = 4) {
    if (!window.pdfjsLib) {
        throw new Error('PDF conversion engine is initializing. Please wait 2 seconds and try again.');
    }

    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const totalPages = pdf.numPages;
    const pagesToRender = Math.min(totalPages, maxPages);
    const pageCanvases = [];

    for (let pageNum = 1; pageNum <= pagesToRender; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        await page.render({
            canvasContext: ctx,
            viewport: viewport
        }).promise;

        pageCanvases.push(canvas);
    }

    const individualPages = pageCanvases.map((c, i) => {
        const dataUrl = c.toDataURL('image/jpeg', 0.85);
        return {
            pageNumber: i + 1,
            totalPages,
            dataUrl,
            base64: dataUrl.split(',')[1],
            mimeType: 'image/jpeg',
            width: c.width,
            height: c.height
        };
    });

    // Also build a stitched master canvas containing ALL pages vertically
    let combinedImage = individualPages[0];
    if (pageCanvases.length > 1) {
        const totalHeight = pageCanvases.reduce((acc, c) => acc + c.height, 0);
        const maxWidth = Math.max(...pageCanvases.map(c => c.width));
        const masterCanvas = document.createElement('canvas');
        masterCanvas.width = maxWidth;
        masterCanvas.height = totalHeight;
        const masterCtx = masterCanvas.getContext('2d');
        masterCtx.fillStyle = '#ffffff';
        masterCtx.fillRect(0, 0, maxWidth, totalHeight);

        let currentY = 0;
        for (const c of pageCanvases) {
            masterCtx.drawImage(c, 0, currentY);
            currentY += c.height;
        }

        const combinedDataUrl = masterCanvas.toDataURL('image/jpeg', 0.85);
        combinedImage = {
            pageNumber: 1,
            totalPages,
            dataUrl: combinedDataUrl,
            base64: combinedDataUrl.split(',')[1],
            mimeType: 'image/jpeg',
            width: maxWidth,
            height: totalHeight
        };
    }

    return {
        pages: individualPages,
        combinedImage
    };
}

/**
 * Universal file processor: accepts either an Image or a PDF.
 * If PDF, converts all pages to images.
 * Returns an object with:
 *   - isPdf: boolean
 *   - pages: Array<{ dataUrl, base64, mimeType, pageNumber }>
 *   - primaryImage: { dataUrl, base64, mimeType } (contains all pages stitched or single page)
 */
export async function processFileForAI(file) {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
        const result = await convertPdfToImages(file);
        const { pages, combinedImage } = result;
        if (!pages || pages.length === 0) {
            throw new Error('Could not extract any pages from the uploaded PDF.');
        }
        return {
            isPdf: true,
            fileName: file.name,
            totalPages: pages[0].totalPages,
            pages,
            primaryImage: combinedImage
        };
    } else {
        // Standard image file (jpg, png, webp)
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const base64 = dataUrl.split(',')[1];
        const pageObj = {
            pageNumber: 1,
            totalPages: 1,
            dataUrl,
            base64,
            mimeType: file.type || 'image/jpeg'
        };

        return {
            isPdf: false,
            fileName: file.name,
            totalPages: 1,
            pages: [pageObj],
            primaryImage: pageObj
        };
    }
}
