import { createWorker } from 'tesseract.js';

export const scanGlucoseMeter = async (imageFile: File | Blob): Promise<number | null> => {
    const worker = await createWorker('eng');

    try {
        const { data: { text } } = await worker.recognize(imageFile);
        console.log('Detected text:', text);

        // Improved regex to find numbers that likely represent glucose values
        // Usually 2-3 digits for mg/dL (e.g., 95, 120, 250)
        // Or 1-2 digits with decimal for mmol/L (e.g., 5.4, 12.1)
        const matches = text.match(/\d+(\.\d+)?/g);

        if (matches) {
            // Find the most likely candidate: typically the largest or clearest number
            // in the context of a glucose meter. For now, we take the first numeric match.
            const value = parseFloat(matches[0]);
            if (!isNaN(value)) {
                return value;
            }
        }

        return null;
    } catch (error) {
        console.error('OCR Error:', error);
        return null;
    } finally {
        await worker.terminate();
    }
};
