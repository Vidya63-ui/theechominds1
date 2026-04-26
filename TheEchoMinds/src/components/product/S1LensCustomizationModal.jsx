import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  S1_INITIAL_PREFERENCES,
  S1_LENS_TYPES,
  S1_USAGE_PURPOSES,
  S1_LENS_MATERIALS,
  S1_FEATURE_TOGGLES,
  S1_SPH_OPTIONS,
  S1_CYL_OPTIONS,
  S1_AXIS_OPTIONS,
  S1_ADD_OPTIONS,
  S1_MULTIFOCAL_LENS_TYPES,
  isS1PreferencesComplete,
  isS1OpticalComplete,
  s1PreferencesReviewRows,
  s1FormatDiopter,
} from "@/lib/s1Preferences.js";

const TOTAL_STEPS = 6;

const stepVariants = {
  enter: { opacity: 0, x: 14 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

const selectClass =
  "mt-1.5 w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/45";

/**
 * @param {{ open: boolean, onClose: () => void, onComplete: (prefs: import("@/lib/s1Preferences.js").S1Preferences) => void }} props
 */
export default function S1LensCustomizationModal({ open, onClose, onComplete }) {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState(() => structuredClone(S1_INITIAL_PREFERENCES));

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setPrefs(structuredClone(S1_INITIAL_PREFERENCES));
  }, [open]);

  const setLensType = (id) =>
    setPrefs((p) => ({
      ...p,
      lensType: id,
      optical: {
        ...p.optical,
        addNear: S1_MULTIFOCAL_LENS_TYPES.has(id) ? p.optical.addNear : null,
      },
    }));

  const patchEye = (side, patch) =>
    setPrefs((p) => ({
      ...p,
      optical: {
        ...p.optical,
        [side]: { ...p.optical[side], ...patch },
      },
    }));

  const setAstigmatism = (side, on) => {
    patchEye(side, {
      astigmatism: on,
      ...(on ? {} : { cyl: null, axis: null }),
    });
  };

  const setCyl = (side, value) => {
    const v = value === "" ? null : value;
    patchEye(side, {
      cyl: v,
      ...(v == null || v === "" ? { axis: null } : {}),
    });
  };

  const setUsage = (id) => setPrefs((p) => ({ ...p, usagePurpose: id }));
  const setMaterial = (id) => setPrefs((p) => ({ ...p, lensMaterial: id }));
  const toggleFeature = (key) =>
    setPrefs((p) => ({
      ...p,
      features: { ...p.features, [key]: !p.features[key] },
    }));

  const canContinue = () => {
    if (step === 0) return !!prefs.lensType;
    if (step === 1) return !!prefs.lensType && isS1OpticalComplete(prefs);
    if (step === 2) return !!prefs.usagePurpose;
    if (step === 3) return !!prefs.lensMaterial;
    if (step === 4) return true;
    return false;
  };

  const goNext = () => {
    if (!canContinue()) return;
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleFinish = () => {
    if (!isS1PreferencesComplete(prefs)) return;
    onComplete(prefs);
  };

  const stepTitles = [
    "Lens type",
    "Optical power (OD / OS)",
    "Usage",
    "Lens material",
    "Features & coatings",
    "Review",
  ];

  const stepBlurbs = [
    "Choose how you will use the prescription lens design.",
    "Sphere for each eye; optional cylinder & axis if you have astigmatism. ADD appears for bifocal or progressive.",
    "Primary use case — we keep this for recommendations.",
    "Lens thickness profile.",
    "Optional coatings — pick any combination.",
    "Confirm before checkout.",
  ];

  const showMultifocalAdd = prefs.lensType && S1_MULTIFOCAL_LENS_TYPES.has(prefs.lensType);

  /** @param {"od"|"os"} side */
  function EyeBlock({ side, title }) {
    const eye = prefs.optical[side];
    const showCyl = eye.astigmatism;
    const showAxis = showCyl && eye.cyl != null && eye.cyl !== "";

    return (
      <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-300/90">{title}</p>

        <div>
          <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500" htmlFor={`${side}-sph`}>
            SPH (sphere)
          </label>
          <select
            id={`${side}-sph`}
            className={selectClass}
            value={eye.sph ?? ""}
            onChange={(e) => patchEye(side, { sph: e.target.value === "" ? null : e.target.value })}
            required
          >
            <option value="">Select…</option>
            {S1_SPH_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {s1FormatDiopter(v)} D
              </option>
            ))}
          </select>
          <p className="mt-1 text-[10px] text-zinc-600">−20.00 to +20.00 · step 0.25</p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <span className="text-sm text-white">Astigmatism correction (CYL)</span>
          <button
            type="button"
            role="switch"
            aria-checked={eye.astigmatism}
            onClick={() => setAstigmatism(side, !eye.astigmatism)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              eye.astigmatism ? "bg-violet-500" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 block h-6 w-6 rounded-full bg-white shadow transition-transform ${
                eye.astigmatism ? "translate-x-[1.25rem]" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {showCyl && (
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500" htmlFor={`${side}-cyl`}>
              CYL (cylinder)
            </label>
            <select
              id={`${side}-cyl`}
              className={selectClass}
              value={eye.cyl ?? ""}
              onChange={(e) => setCyl(side, e.target.value)}
            >
              <option value="">Select…</option>
              {S1_CYL_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {s1FormatDiopter(v)} D
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-zinc-600">−6.00 to +6.00 · step 0.25</p>
          </div>
        )}

        {showAxis && (
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500" htmlFor={`${side}-axis`}>
              Axis (degrees)
            </label>
            <select
              id={`${side}-axis`}
              className={selectClass}
              value={eye.axis ?? ""}
              onChange={(e) => patchEye(side, { axis: e.target.value === "" ? null : e.target.value })}
            >
              <option value="">Select…</option>
              {S1_AXIS_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}°
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-zinc-600">0–180°</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="s1-lens-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="s1-lens-form-title"
        >
          <button type="button" className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl rounded-3xl border border-violet-400/25 bg-zinc-950/95 backdrop-blur-xl shadow-2xl shadow-violet-950/40 max-h-[min(92vh,760px)] flex flex-col"
          >
            <div className="flex items-start justify-between gap-3 p-5 sm:p-6 border-b border-white/10 shrink-0">
              <div className="min-w-0 pr-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300/80 mb-1">
                  Step {step + 1} of {TOTAL_STEPS}
                </p>
                <h2 id="s1-lens-form-title" className="text-lg font-semibold text-white leading-tight">
                  Customize your lenses
                </h2>
                <p className="text-xs text-zinc-500 mt-1.5">{stepTitles[step]} — {stepBlurbs[step]}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="shrink-0 rounded-full h-10 w-10 p-0 min-w-0 border-white/15 text-zinc-400 hover:text-white hover:bg-white/10"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-5 sm:px-6 pt-4 flex gap-1.5 shrink-0" aria-hidden>
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    i <= step ? "bg-violet-500" : "bg-white/10"
                  }`}
                />
              ))}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-4"
                >
                  {step === 0 && (
                    <>
                      <p className="text-sm text-zinc-400">Choose the lens style that best matches how you&apos;ll use EchoLens S.1.</p>
                      <ul className="space-y-2.5">
                        {S1_LENS_TYPES.map((opt) => (
                          <li key={opt.id}>
                            <button
                              type="button"
                              onClick={() => setLensType(opt.id)}
                              className={`w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-200 ${
                                prefs.lensType === opt.id
                                  ? "border-violet-400/55 bg-violet-500/[0.12] ring-1 ring-violet-400/20 shadow-[0_0_24px_-8px_rgba(139,92,246,0.35)]"
                                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                              }`}
                            >
                              <span className="block text-sm font-semibold text-white">{opt.title}</span>
                              <span className="block text-xs text-zinc-500 mt-1 leading-relaxed">{opt.subtitle}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <p className="text-sm text-zinc-400">
                        Enter sphere for <strong className="text-white">OD (right)</strong> and{" "}
                        <strong className="text-white">OS (left)</strong>. Turn on astigmatism only if you have cylinder
                        and axis on your prescription.
                      </p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <EyeBlock side="od" title="Right eye (OD)" />
                        <EyeBlock side="os" title="Left eye (OS)" />
                      </div>

                      {showMultifocalAdd && (
                        <div className="rounded-2xl border border-violet-400/25 bg-violet-500/[0.08] p-4">
                          <label
                            className="block text-xs font-semibold uppercase tracking-wider text-violet-200/90"
                            htmlFor="add-near"
                          >
                            ADD (near addition)
                          </label>
                          <select
                            id="add-near"
                            className={selectClass}
                            value={prefs.optical.addNear ?? ""}
                            onChange={(e) =>
                              setPrefs((p) => ({
                                ...p,
                                optical: { ...p.optical, addNear: e.target.value === "" ? null : e.target.value },
                              }))
                            }
                          >
                            <option value="">Select…</option>
                            {S1_ADD_OPTIONS.map((v) => (
                              <option key={v} value={v}>
                                +{Number(v).toFixed(2)} D
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-[10px] text-violet-200/60">+0.75 to +3.50 · step 0.25 · bifocal / progressive only</p>
                        </div>
                      )}
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <p className="text-sm font-medium text-white">What will you primarily use these glasses for?</p>
                      <p className="text-xs text-zinc-500 -mt-2">We&apos;ll use this later for recommendations.</p>
                      <ul className="space-y-2.5 pt-1">
                        {S1_USAGE_PURPOSES.map((opt) => (
                          <li key={opt.id}>
                            <button
                              type="button"
                              onClick={() => setUsage(opt.id)}
                              className={`w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-200 ${
                                prefs.usagePurpose === opt.id
                                  ? "border-violet-400/55 bg-violet-500/[0.12] ring-1 ring-violet-400/20"
                                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                              }`}
                            >
                              <span className="block text-sm font-semibold text-white">{opt.title}</span>
                              <span className="block text-xs text-zinc-500 mt-1">{opt.subtitle}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <p className="text-sm text-zinc-400">Pick a thickness profile — balance budget, weight, and edge profile.</p>
                      <ul className="space-y-2.5">
                        {S1_LENS_MATERIALS.map((opt) => (
                          <li key={opt.id} className="relative">
                            {opt.recommended && (
                              <span className="absolute -top-2 right-3 z-10 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black shadow">
                                Recommended
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setMaterial(opt.id)}
                              className={`relative w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-200 ${
                                prefs.lensMaterial === opt.id
                                  ? "border-violet-400/55 bg-violet-500/[0.12] ring-1 ring-violet-400/20"
                                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                              } ${opt.recommended ? "pt-4" : ""}`}
                            >
                              <span className="block text-sm font-semibold text-white">{opt.title}</span>
                              <span className="block text-xs text-zinc-500 mt-1 leading-relaxed">{opt.subtitle}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <p className="text-sm text-zinc-400">Add any coatings you want — mix and match. All optional.</p>
                      <div className="rounded-2xl border border-white/10 bg-black/25 divide-y divide-white/[0.06] overflow-hidden">
                        {S1_FEATURE_TOGGLES.map((row) => {
                          const on = !!prefs.features[row.key];
                          return (
                            <div key={row.key} className="flex items-start justify-between gap-4 px-4 py-3.5 sm:px-4">
                              <div className="min-w-0 pt-0.5">
                                <p className="text-sm font-medium text-white">{row.title}</p>
                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{row.helper}</p>
                              </div>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={on}
                                onClick={() => toggleFeature(row.key)}
                                className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                                  on ? "bg-violet-500" : "bg-zinc-700"
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 left-0.5 block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                                    on ? "translate-x-[1.25rem]" : "translate-x-0"
                                  }`}
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {step === 5 && (
                    <>
                      <p className="text-sm text-zinc-400">Double-check your choices before we add EchoLens S.1 to your cart.</p>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                        {s1PreferencesReviewRows(prefs).map((row) => (
                          <div
                            key={row.label}
                            className="flex flex-col gap-0.5 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"
                          >
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{row.label}</span>
                            <span className="text-sm text-white leading-snug">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="shrink-0 border-t border-white/10 p-5 sm:p-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-between sm:items-center">
              <div className="flex gap-2 w-full sm:w-auto">
                {step > 0 ? (
                  <Button type="button" variant="outline" className="rounded-full flex-1 sm:flex-none" onClick={goBack}>
                    Back
                  </Button>
                ) : (
                  <Button type="button" variant="outline" className="rounded-full flex-1 sm:flex-none" onClick={onClose}>
                    Cancel
                  </Button>
                )}
              </div>
              {step < TOTAL_STEPS - 1 ? (
                <Button
                  type="button"
                  className="rounded-full bg-violet-600 hover:bg-violet-500 text-white w-full sm:w-auto sm:min-w-[10rem]"
                  onClick={goNext}
                  disabled={!canContinue()}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  className="rounded-full bg-violet-600 hover:bg-violet-500 text-white w-full sm:w-auto sm:min-w-[12rem]"
                  onClick={handleFinish}
                  disabled={!isS1PreferencesComplete(prefs)}
                >
                  Add to cart &amp; checkout
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
