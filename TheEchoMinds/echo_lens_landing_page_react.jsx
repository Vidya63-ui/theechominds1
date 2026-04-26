import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";

export default function EchoLensWebsite() {
    const [email, setEmail] = useState("");

    const features = [
        {
            title: "Context Vision",
            desc: "Instantly identifies places, objects, and visual cues with fast on-device AI.",
        },
        {
            title: "Live Language",
            desc: "Real-time subtitles and translation layered naturally into your environment.",
        },
        {
            title: "Voice Companion",
            desc: "Natural, hands-free guidance that responds in a calm, conversational tone.",
        },
        {
            title: "Daylong Runtime",
            desc: "Engineered power efficiency for continuous daily wear and reliable performance.",
        },
        {
            title: "Private by Design",
            desc: "Core processing stays local, giving you speed and stronger privacy controls.",
        },
        {
            title: "Featherweight Build",
            desc: "Balanced frame geometry that stays comfortable from morning commute to night.",
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#07090d] text-zinc-100 [font-family:'Sora','Manrope','Segoe_UI',sans-serif]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,146,43,0.22),transparent_44%),radial-gradient(circle_at_82%_8%,rgba(45,212,191,0.2),transparent_42%),linear-gradient(to_bottom,#07090d,#0a0f17_55%,#07090d)]" />
            <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />

            <section className="relative px-6 pt-10 pb-20 md:px-10 md:pt-16 md:pb-28">
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mx-auto max-w-6xl"
                >
                    <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-zinc-300 backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        The EchoMinds Labs
                    </div>

                    <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                                EchoLens
                                <span className="block bg-gradient-to-r from-[#ff9f45] via-[#ffd48f] to-[#8de7d8] bg-clip-text text-transparent">
                                    See More. Speak Less.
                                </span>
                            </h1>
                            <p className="mt-7 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
                                Smart glasses shaped for real life - fast AI context, live translation, and voice-first
                                assistance in a frame that feels like premium eyewear, not a prototype.
                            </p>

                            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                                <Button className="rounded-full bg-[#ff9f45] px-8 py-6 text-base font-semibold text-[#111] hover:bg-[#ffb066]">
                                    Reserve EchoLens
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-full border-white/30 bg-white/5 px-8 py-6 text-base text-white backdrop-blur hover:bg-white/15"
                                >
                                    Watch Demo
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/15 bg-black/30 p-5 backdrop-blur-xl">
                            <video autoPlay loop muted playsInline className="h-[300px] w-full rounded-2xl object-cover md:h-[360px]">
                                <source src="/videos/echolens-bg.mp4" type="video/mp4" />
                            </video>
                            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs uppercase tracking-[0.18em] text-zinc-300">
                                <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">Realtime AI</div>
                                <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">Spatial Audio</div>
                                <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">Private Core</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="relative px-6 pb-20 md:px-10 md:pb-24">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                        { label: "Weight", value: "39g" },
                        { label: "Battery", value: "18h" },
                        { label: "Latency", value: "<120ms" },
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur"
                        >
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{stat.label}</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="relative px-6 py-20 md:px-10 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl"
                    >
                        Hardware restraint.
                        <span className="text-zinc-400"> Software intelligence.</span>
                    </motion.h2>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.35 }}
                                transition={{ duration: 0.45, delay: index * 0.06 }}
                            >
                                <Card className="h-full rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 shadow-none transition-transform duration-200 hover:-translate-y-1">
                                    <CardContent className="p-7">
                                        <p className="text-xs uppercase tracking-[0.2em] text-[#ffba76]">
                                            0{(index % 9) + 1}
                                        </p>
                                        <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                                        <p className="mt-3 text-sm leading-relaxed text-zinc-300">{feature.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative px-6 py-20 md:px-10 md:py-28">
                <div className="mx-auto grid max-w-6xl items-center gap-12 rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#111621] to-[#0c1119] p-7 md:grid-cols-2 md:p-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.55 }}
                    >
                        <p className="text-xs uppercase tracking-[0.22em] text-[#8de7d8]">Designed For Daily Flow</p>
                        <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Built for humans</h2>
                        <p className="mt-6 text-zinc-300">
                            EchoLens disappears into your routine while keeping intelligence close. Balanced weight,
                            subtle curves, and low-latency interaction make it feel natural from commute to calls.
                        </p>
                        <div className="mt-8 space-y-3 text-sm text-zinc-300">
                            <p>Compare finishes, frame profiles, and accessories built around everyday wear.</p>
                            <Button
                                className="rounded-full bg-white px-8 text-black hover:bg-zinc-200"
                                onClick={() => (window.location.href = "https://theechominds.com/products/echolens")}
                            >
                                View Product
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.55 }}
                        className="relative"
                    >
                        <div className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-tr from-[#ff9f45]/25 to-[#8de7d8]/20 blur-2xl" />
                        <div className="grid h-[380px] grid-cols-2 gap-4 rounded-3xl border border-white/15 bg-black/25 p-4 md:h-[420px]">
                            <div className="overflow-hidden rounded-2xl border border-white/10">
                                <img
                                    src="/images/echolens-front.jpg"
                                    alt="EchoLens front view"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-white/10">
                                <img
                                    src="/images/echolens-side.jpg"
                                    alt="EchoLens side view"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="col-span-2 overflow-hidden rounded-2xl border border-white/10">
                                <img
                                    src="/images/echolens-case.jpg"
                                    alt="EchoLens case and accessories"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="relative px-6 py-20 md:px-10 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.55 }}
                    className="mx-auto max-w-4xl rounded-3xl border border-white/20 bg-white/5 p-8 text-center backdrop-blur md:p-12"
                >
                    <h2 className="text-3xl font-semibold text-white md:text-4xl">Get Early Access</h2>
                    <p className="mt-3 text-zinc-300">Join the waitlist and get launch updates first.</p>
                    <div className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="h-12 flex-1 rounded-full border border-white/20 bg-white px-5 text-black placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#8de7d8]"
                        />
                        <Button className="h-12 rounded-full bg-[#8de7d8] px-7 font-semibold text-[#072226] hover:bg-[#a1efe3]">
                            Join Waitlist
                        </Button>
                    </div>
                </motion.div>
            </section>

            <footer className="relative border-t border-white/10 px-6 py-10 text-center text-sm text-zinc-400 md:px-10">
                {new Date().getFullYear()} TheEchoMinds. All rights reserved. EchoLens.
            </footer>
        </div>
    );
}
