import _error from "./io/_error.js";
import fsp from "fs/promises";
function calculateReadSize(totalSizeKB, chunkSizeKB, chunkIndex) {
    if (totalSizeKB < chunkSizeKB && chunkIndex === 0)
        return totalSizeKB;
    else if (chunkIndex === 0)
        return chunkSizeKB;
    const progress = chunkIndex * chunkSizeKB;
    const remaining = totalSizeKB - progress;
    if (remaining < chunkSizeKB)
        return remaining;
    return chunkSizeKB;
}
export default async function chunkFile({ chunkSize, filePath, outputDir }) {
    try {
        const stats = await fsp.stat(filePath);
        const chunks = Math.ceil(stats.size / (chunkSize * 1024));
        const file = await fsp.open(filePath, "r");
        let progressKB = 0;
        for (let i = 0; i < chunks; i++) {
            const readSize = calculateReadSize(stats.size / 1024, chunkSize, i);
            console.log(readSize);
            const buffer = Buffer.alloc(readSize * 1024);
            await file.read(buffer, 0, readSize * 1024, i * chunkSize * 1024);
            const chunkPath = `${outputDir}/chunk-${i + 1}.chunk`;
            await fsp.writeFile(chunkPath, buffer);
            progressKB += readSize;
        }
    }
    catch (error) {
        _error("Unable to chunk file. Error: " + String(error));
        return;
    }
}
