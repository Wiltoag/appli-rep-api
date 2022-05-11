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