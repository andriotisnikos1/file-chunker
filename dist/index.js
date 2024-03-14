import verifyFolder from "./util/verifyFolder.js";
import verifyFilePath from "./util/verifyFilePath.js";
import chunkFile from "./util/chunkFile.js";
/**
 * Chunks a file into smaller pieces
 */
export default async ({ chunkSize = 1024, filePath, outputDir }) => {
    filePath = await verifyFilePath(filePath);
    if (filePath.length === 0)
        return;
    outputDir = await verifyFolder(outputDir);
    if (outputDir.length === 0)
        return;
    await chunkFile({ chunkSize, filePath, outputDir });
};
