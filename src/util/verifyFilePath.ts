import _error from './io/_error.js';
import fsp from 'fs/promises';

export default async (filePath: string): Promise<string> => {
    try {
        const stat = await fsp.stat(filePath);
        if (stat.isFile()) return filePath; 
        throw new Error();
    } catch (error) {
        _error(`The file '${filePath}' does not exist or cant be accessed. Please provide a valid file path.`);
        return ""
    }
}