import verifyFolder from "./util/verifyFolder.js";
import verifyFilePath from "./util/verifyFilePath.js";
import chunkFile from "./util/chunkFile.js";

export interface ChunkOptions {
    /**
     * The size of each chunk in kilobytes
     * @default 1024
     * @minimum 1
    */
    chunkSize: number;
    /**
     * The path to the file to be chunked
     * @format local or absolute path
    */
    filePath: string;
    /**
     * The directory where the chunks will be saved
     * @format local or absolute path
    */
    outputDir: string;
}

/**
 * Chunks a file into smaller pieces
 */
export default async ({
    chunkSize = 1024,
    filePath,
    outputDir
}: ChunkOptions) => {
    filePath = await verifyFilePath(filePath);
    if (filePath.length === 0) return;
    outputDir = await verifyFolder(outputDir);
    if (outputDir.length === 0) return;
    await chunkFile({ chunkSize, filePath, outputDir });
};