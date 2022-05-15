import crypto from 'crypto';
import { Errors } from './errors';

export const normalize = (str: string): string => {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(" ", "").toLowerCase().replace(/\W/g, "");
}
export const escapeHtml = (text: string): string => {
    const map = new Map<string, string>([
        ['&', '&amp;'],
        ['<', '&lt;'],
        ['>', '&gt;'],
        ['"', '&quot;'],
        ["'", '&#039;']
    ]);

    return text.replace(/[&<>"']/g, (m) => map.get(m) ?? m);
}

export const invalidJson = (scheme: object): object => {
    return { ...Errors.invalidJson, expected: scheme };
}

export const generateToken = () => {
    return crypto.randomBytes(64).toString("hex");
}