/** Formal Japanese numerals used to number categories. */
export const NUMERALS = ["壱", "弐", "参", "四", "五", "六", "七", "八", "九", "十"] as const;

export const numeral = (index: number): string => NUMERALS[index] ?? String(index + 1);
