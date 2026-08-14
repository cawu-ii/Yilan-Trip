// Fixed 4-person color tokens. Class strings are written out in full so
// Tailwind's build-time scanner can find them — never string-concatenate
// these (e.g. `bg-${token}`), it will get purged.

export type ColorToken = "wenwen" | "yaxuan" | "zhuangjia" | "qiao";

export interface ColorClasses {
  /** soft tinted background, e.g. for badges/cards */
  soft: string;
  /** matching readable text color on top of `soft` */
  ink: string;
  /** solid dot / avatar background */
  dot: string;
  /** border color matching the person */
  border: string;
  /** ring color for selected/active states */
  ring: string;
}

export const PERSON_COLORS: Record<ColorToken, ColorClasses> = {
  // 芒果黃 mango yellow
  wenwen: {
    soft: "bg-wenwen",
    ink: "text-wenwen-ink",
    dot: "bg-wenwen-solid",
    border: "border-wenwen-solid",
    ring: "ring-wenwen-solid",
  },
  // 珊瑚橙 coral orange
  yaxuan: {
    soft: "bg-yaxuan",
    ink: "text-yaxuan-ink",
    dot: "bg-yaxuan-solid",
    border: "border-yaxuan-solid",
    ring: "ring-yaxuan-solid",
  },
  // 海島藍 island blue
  zhuangjia: {
    soft: "bg-zhuangjia",
    ink: "text-zhuangjia-ink",
    dot: "bg-zhuangjia-solid",
    border: "border-zhuangjia-solid",
    ring: "ring-zhuangjia-solid",
  },
  // 棕櫚綠 palm green
  qiao: {
    soft: "bg-qiao",
    ink: "text-qiao-ink",
    dot: "bg-qiao-solid",
    border: "border-qiao-solid",
    ring: "ring-qiao-solid",
  },
};

export function colorClasses(token: string): ColorClasses {
  return PERSON_COLORS[token as ColorToken] ?? PERSON_COLORS.wenwen;
}
