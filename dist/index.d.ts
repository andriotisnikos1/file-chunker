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
declare const _default: ({ chunkSize, filePath, outputDir }: ChunkOptions) => Promise<void>;
export default _default;
