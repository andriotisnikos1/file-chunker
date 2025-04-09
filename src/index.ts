import verifyFolder from "./util/verifyFolder.js";
import verifyFilePath from "./util/verifyFilePath.js";
import chunkFile from "./util/chunkFile.js";

export interface ChunkOptions {
    /**
     * @brief The size of each chunk in kilobytes
     * @default 1024
     * @minimum 1
    */
    chunkSize: number;
    /**
     * @brief The path to the file to be chunked
     * @format local or absolute path
    */
    filePath: string;
    /**
     * @brief The directory where the chunks will be saved
     * @format local or absolute path
    */
    outputDir: string;
    /**
     * @brief A function that will be called every time a chunk is created
     * @param chunk - The number of the chunk that was created
     * @param totalChunks - The total number of chunks that will be created
    */
    onProgress?: (chunkNumber: number, totalChunks: number, chunkData: Buffer) => void | Promise<void>;
    /**
     * Whether or not to pass the chunk data to the onProgress callback and not to the disk
     * @default false
    */
    passChunkToCallback?: boolean;
}

/**
 * Chunks a file into smaller pieces
 */
export default async function td (opts: ChunkOptions)  {
    opts.filePath = await verifyFilePath(opts.filePath);
    if (opts.filePath.length === 0) return;
    if (!opts.passChunkToCallback) {
        opts.outputDir = await verifyFolder(opts.outputDir);
        if (opts.outputDir.length === 0) return;
    }
    await chunkFile(opts);
};

export {getFileChunkStats} from "./util/chunkFile.js"