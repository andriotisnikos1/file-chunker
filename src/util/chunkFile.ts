import _error from "./io/_error.js";
import { ChunkOptions } from "../index.js";
import fsp from "fs/promises";
import fs, { Stats } from "fs";

function calculateReadSize(
    totalSizeKB: number,
    chunkSizeKB: number,
    chunkIndex: number,
  ): number {
    if (totalSizeKB < chunkSizeKB && chunkIndex === 0) return totalSizeKB;
    else if (chunkIndex === 0) return chunkSizeKB;
    const progress = chunkIndex * chunkSizeKB;
    const remaining = totalSizeKB - progress;
    if (remaining < chunkSizeKB) return remaining;
    return chunkSizeKB;
  }

/**
 * Calculates the number of chunks and the stats of a file
 * @param filePath - The path to the file (local or absolute path)
 * @param chunkSize (in KB) - The size of each chunk in kilobytes
 */
export async function getFileChunkStats(filePath: string, chunkSize: number): Promise<{stats: Stats, chunks: number}| null> {
    try {
        const stats = await fsp.stat(filePath);
        const chunks = Math.ceil(stats.size / (chunkSize * 1024));
        return { stats, chunks };
    } catch (error) {
        _error("Unable to get file chunk stats. Error: " + String(error))
        return null;
    }
}

export default async function chunkFile({ chunkSize, filePath, outputDir, onProgress,passChunkToCallback = false }: ChunkOptions): Promise<void> {
    try {
        const chunkStats = await getFileChunkStats(filePath, chunkSize);
        if (!chunkStats) return;
        const { stats, chunks } = chunkStats;
        const file = await fsp.open(filePath, "r");
        let progressKB = 0;
        for (let i = 0; i < chunks; i++) {
            const readSize = calculateReadSize(stats.size / 1024, chunkSize, i);
            const buffer = Buffer.alloc(readSize * 1024);
            await file.read(buffer, 0, readSize * 1024, i * chunkSize * 1024);
            const chunkPath = `${outputDir}/${i}.chunk`;
            if (!passChunkToCallback) await fsp.writeFile(chunkPath, buffer);
            progressKB += readSize;
            if (onProgress) await onProgress(i, chunks, passChunkToCallback ? buffer : Buffer.alloc(0));
        }
    } catch (error) {
        _error("Unable to chunk file. Error: " + String(error))
        return;
    }
}