export function normalize(str: string): string {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(" ", "").toLowerCase().replace(/\W/g, "");
}