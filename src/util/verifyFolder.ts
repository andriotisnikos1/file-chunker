import { promises as fsp } from 'fs';
import _error from './io/_error.js';

export default async (folderPath: string): Promise<string> => {
    try {
        const stat = await fsp.stat(folderPath);
        if (stat.isDirectory()) return folderPath; 
        throw new Error();
    } catch (error) {
        _error(`The folder '${folderPath}' does not exist or cant be accessed. Please provide a valid folder path.`);
        return ""
    }
}