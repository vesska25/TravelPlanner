import countryList from "country-list";

// Full-bleed flag image URL from an ISO country code (e.g. "GR").
export function flagUrl(code, w = 640) {
  if (!code) return null;
  return `https://flagcdn.com/w${w}/${code.toLowerCase()}.png`;
}

// Small flag (chips, selects).
export function flagThumb(code) {
  if (!code) return null;
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

// "GR" -> "Greece"
export function countryName(code) {
  if (!code) return "";
  return countryList.getName(code) || code;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function fmtDate(iso) {
  if (!iso) return "—";
  const p = String(iso).split("-");
  if (p.length < 3) return iso;
  return `${MONTHS[(+p[1]) - 1]} ${+p[2]}`;
}

export function dateRange(a, b) {
  if (!a && !b) return "Dates TBD";
  return `${fmtDate(a)} – ${fmtDate(b)}`;
}

const SYM = { EUR: "€", USD: "$", GBP: "£", CHF: "CHF " };

export function money(budget, currency) {
  const n = Number(budget || 0).toLocaleString("en-US");
  return (SYM[currency] || "") + n;
}

// Status pill colors (Coastal palette).
export const STATUS_META = {
  PLANNED:   { bg: "#e8d9b5", color: "#7a6526", label: "PLANNED" },
  ONGOING:   { bg: "#2f93ab", color: "#ffffff", label: "ONGOING" },
  COMPLETED: { bg: "#e8eef0", color: "#5b7785", label: "DONE" },
};

export function statusMeta(status) {
  return STATUS_META[status] || STATUS_META.PLANNED;
}

// Place categories -> Phosphor icon + label.
export const CATEGORY_META = {
  RESTAURANT: { icon: "ph-fork-knife", label: "Restaurant" },
  HOTEL:      { icon: "ph-bed",        label: "Hotel" },
  MUSEUM:     { icon: "ph-bank",       label: "Museum" },
  ATTRACTION: { icon: "ph-star",       label: "Attraction" },
  NATURE:     { icon: "ph-mountains",  label: "Nature" },
  OTHER:      { icon: "ph-map-pin",    label: "Other" },
};

export function categoryMeta(cat) {
  return CATEGORY_META[cat] || CATEGORY_META.OTHER;
}

// Shared input / label / button class strings used across pages.
export const inputCls =
  "w-full bg-white border border-[#d9e6ec] rounded-xl px-3 py-2.5 text-[#143642] text-sm outline-none transition focus:border-[#2f93ab] focus:ring-2 focus:ring-[#2f93ab]/20 placeholder:text-[#9fb3bc]";

export const labelCls = "text-[13px] font-semibold text-[#143642]";

export const primaryBtn =
  "inline-flex items-center justify-center gap-2 bg-[#2f93ab] text-white font-semibold text-sm rounded-xl px-5 py-3 shadow-[0_6px_16px_rgba(47,147,171,0.3)] hover:-translate-y-0.5 transition-transform cursor-pointer disabled:opacity-60";

export const ghostBtn =
  "inline-flex items-center justify-center gap-2 bg-white text-[#5b7785] font-semibold text-sm rounded-xl px-5 py-3 border border-[#d9e6ec] hover:border-[#b9ccd4] transition-colors cursor-pointer";
