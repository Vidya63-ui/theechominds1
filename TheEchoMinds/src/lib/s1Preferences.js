/**
 * EchoLens S.1 — lens preferences plus structured optical inputs (SPH / optional CYL+axis / ADD for multifocals).
 * Cart stores `s1Preferences` on the line for checkout and fulfillment.
 *
 * @typedef {{
 *   sph: string | null,
 *   astigmatism: boolean,
 *   cyl: string | null,
 *   axis: string | null,
 * }} S1EyeRx
 *
 * @typedef {{
 *   od: S1EyeRx,
 *   os: S1EyeRx,
 *   addNear: string | null,
 * }} S1Optical
 *
 * @typedef {{
 *   lensType: string | null,
 *   usagePurpose: string | null,
 *   lensMaterial: string | null,
 *   features: {
 *     antiGlare: boolean,
 *     blueLight: boolean,
 *     uvProtection: boolean,
 *     scratchResistant: boolean,
 *     photochromic: boolean,
 *   },
 *   optical: S1Optical,
 * }} S1Preferences
 */

/** @returns {string[]} values as fixed two-decimal strings, step 0.25 diopters */
export function s1QuarterDiopterStrings(fromD, toD) {
  const out = [];
  const a = Math.round(fromD * 100);
  const b = Math.round(toD * 100);
  for (let x = a; x <= b; x += 25) {
    out.push((x / 100).toFixed(2));
  }
  return out;
}

/** Sphere −20.00 … +20.00, step 0.25 */
export const S1_SPH_OPTIONS = s1QuarterDiopterStrings(-20, 20);

/** Cylinder −6.00 … +6.00, step 0.25 */
export const S1_CYL_OPTIONS = s1QuarterDiopterStrings(-6, 6);

/** Axis degrees 0–180 */
export const S1_AXIS_OPTIONS = Array.from({ length: 181 }, (_, i) => String(i));

/** Near addition +0.75 … +3.50, step 0.25 */
export const S1_ADD_OPTIONS = s1QuarterDiopterStrings(0.75, 3.5);

export const S1_MULTIFOCAL_LENS_TYPES = new Set(["bifocal", "progressive"]);

const emptyEye = () => ({
  sph: null,
  astigmatism: false,
  cyl: null,
  axis: null,
});

export const S1_INITIAL_PREFERENCES = {
  lensType: null,
  usagePurpose: null,
  lensMaterial: null,
  features: {
    antiGlare: false,
    blueLight: false,
    uvProtection: false,
    scratchResistant: false,
    photochromic: false,
  },
  optical: {
    od: emptyEye(),
    os: emptyEye(),
    addNear: null,
  },
};

export const S1_LENS_TYPES = [
  {
    id: "single_vision",
    title: "Single Vision",
    subtitle: "Everyday use — one focal distance for most of the day.",
  },
  {
    id: "computer",
    title: "Computer Glasses",
    subtitle: "Screen use — easier long sessions in front of displays.",
  },
  {
    id: "zero_power",
    title: "Zero Power",
    subtitle: "Fashion / protection — plano lenses with optional coatings.",
  },
  { id: "bifocal", title: "Bifocal", subtitle: "Two distinct zones for near and distance in one lens." },
  {
    id: "progressive",
    title: "Progressive",
    subtitle: "Smooth transition from distance through intermediate to near.",
  },
];

export const S1_USAGE_PURPOSES = [
  { id: "daily", title: "Daily wear", subtitle: "General indoor and outdoor routines." },
  { id: "screen", title: "Screen / laptop", subtitle: "Primarily office, study, or remote work." },
  { id: "driving", title: "Driving", subtitle: "Road clarity and comfort behind the wheel." },
  { id: "outdoor", title: "Outdoor use", subtitle: "Sun, sport, and brighter environments." },
];

export const S1_LENS_MATERIALS = [
  {
    id: "standard",
    title: "Standard",
    subtitle: "Affordable, slightly thicker profile.",
    recommended: false,
  },
  {
    id: "thin",
    title: "Thin",
    subtitle: "Recommended for comfort and a slimmer edge.",
    recommended: true,
  },
  {
    id: "ultra_thin",
    title: "Ultra Thin",
    subtitle: "Lightest feel — ideal for higher corrections.",
    recommended: false,
  },
];

export const S1_FEATURE_TOGGLES = [
  {
    key: "antiGlare",
    title: "Anti-glare",
    helper: "Cuts reflections from lamps, screens, and wet roads at night.",
  },
  {
    key: "blueLight",
    title: "Blue light protection",
    helper: "Filters a portion of high-energy blue from digital displays.",
  },
  {
    key: "uvProtection",
    title: "UV protection",
    helper: "Helps shield your eyes from ultraviolet outdoors.",
  },
  {
    key: "scratchResistant",
    title: "Scratch resistant",
    helper: "Harder surface layer for everyday knocks and cleaning.",
  },
  {
    key: "photochromic",
    title: "Photochromic",
    helper: "Auto darkening in sunlight — convenience indoors and out.",
  },
];

const LENS_TYPE_LABEL = Object.fromEntries(S1_LENS_TYPES.map((o) => [o.id, o.title]));
const USAGE_LABEL = Object.fromEntries(S1_USAGE_PURPOSES.map((o) => [o.id, o.title]));
const MATERIAL_LABEL = Object.fromEntries(S1_LENS_MATERIALS.map((o) => [o.id, o.title]));

/**
 * Optional add-ons for cart total (simple flat map — adjust anytime).
 * @param {S1Preferences} p
 */
export function s1PreferencesSurchargeInr(p) {
  if (!p?.lensMaterial) return 0;
  let n = 0;
  if (p.lensMaterial === "thin") n += 499;
  if (p.lensMaterial === "ultra_thin") n += 1299;
  const f = p.features || {};
  if (f.antiGlare) n += 699;
  if (f.blueLight) n += 599;
  if (f.uvProtection) n += 0;
  if (f.scratchResistant) n += 399;
  if (f.photochromic) n += 1399;
  return n;
}

/** @param {S1EyeRx} eye */
function isEyeRxComplete(eye) {
  if (!eye || eye.sph == null || eye.sph === "") return false;
  if (!eye.astigmatism) return true;
  if (eye.cyl == null || eye.cyl === "") return false;
  if (eye.axis == null || eye.axis === "") return false;
  return true;
}

/** Optical step valid once lens type is chosen */
export function isS1OpticalComplete(p) {
  const o = p?.optical;
  if (!o?.od || !o?.os) return false;
  if (!isEyeRxComplete(o.od) || !isEyeRxComplete(o.os)) return false;
  if (S1_MULTIFOCAL_LENS_TYPES.has(p.lensType)) {
    if (o.addNear == null || o.addNear === "") return false;
  }
  return true;
}

export function isS1PreferencesComplete(p) {
  return !!(p?.lensType && isS1OpticalComplete(p) && p?.usagePurpose && p?.lensMaterial);
}

/** Format signed diopter for display */
export function s1FormatDiopter(valueStr) {
  if (valueStr == null || valueStr === "") return "—";
  const n = Number(valueStr);
  if (Number.isNaN(n)) return String(valueStr);
  const s = Math.abs(n).toFixed(2);
  if (n === 0) return "0.00";
  return (n > 0 ? "+" : "−") + s;
}

/** One-line cart / lens summary */
export function s1PreferencesLensLabel(p) {
  if (!isS1PreferencesComplete(p)) return "";
  const parts = [LENS_TYPE_LABEL[p.lensType], MATERIAL_LABEL[p.lensMaterial]];
  return parts.filter(Boolean).join(" · ");
}

/** @param {S1EyeRx} eye */
function eyeRxLine(eye) {
  if (!eye) return "—";
  let s = `SPH ${s1FormatDiopter(eye.sph)}`;
  if (eye.astigmatism) {
    s += ` · CYL ${s1FormatDiopter(eye.cyl)} · Axis ${eye.axis ?? "—"}°`;
  }
  return s;
}

/** Key/value rows for review UI and receipts */
export function s1PreferencesReviewRows(p) {
  if (!p) return [];
  const rows = [];
  if (p.lensType) rows.push({ label: "Lens type", value: LENS_TYPE_LABEL[p.lensType] || p.lensType });
  const o = p.optical;
  if (o?.od && o?.os) {
    rows.push({ label: "Optical — OD (right)", value: eyeRxLine(o.od) });
    rows.push({ label: "Optical — OS (left)", value: eyeRxLine(o.os) });
    if (S1_MULTIFOCAL_LENS_TYPES.has(p.lensType) && o.addNear) {
      rows.push({ label: "ADD (near)", value: `+${Number(o.addNear).toFixed(2)} D` });
    }
  }
  if (p.usagePurpose) rows.push({ label: "Usage", value: USAGE_LABEL[p.usagePurpose] || p.usagePurpose });
  if (p.lensMaterial) rows.push({ label: "Material", value: MATERIAL_LABEL[p.lensMaterial] || p.lensMaterial });
  const f = p.features || {};
  const on = S1_FEATURE_TOGGLES.filter((t) => f[t.key]).map((t) => t.title);
  rows.push({
    label: "Features",
    value: on.length ? on.join(", ") : "None selected",
  });
  return rows;
}

export function cloneS1Preferences(p) {
  const opt = p.optical || S1_INITIAL_PREFERENCES.optical;
  return {
    lensType: p.lensType,
    usagePurpose: p.usagePurpose,
    lensMaterial: p.lensMaterial,
    features: { ...S1_INITIAL_PREFERENCES.features, ...(p.features || {}) },
    optical: {
      od: { ...emptyEye(), ...opt.od },
      os: { ...emptyEye(), ...opt.os },
      addNear: S1_MULTIFOCAL_LENS_TYPES.has(p.lensType) ? opt.addNear ?? null : null,
    },
  };
}
