import { Button } from "@/components/ui/button";
import HomePageBackground from "@/components/HomePageBackground.jsx";
import FeatureShowcase from "@/components/FeatureShowcase.jsx";
import SiteFooter from "@/components/SiteFooter.jsx";
import BlogSection from "@/components/BlogSection.jsx";
import ProductShowcase from "@/components/ProductShowcase.jsx";
import HomePublicGallery from "@/components/HomePublicGallery.jsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { useEmployeeAuth } from "@/context/EmployeeAuthContext.jsx";
import { Menu, User, X } from "lucide-react";
import { useState } from "react";
import siteLogo from "./logo.png";

export default function EchoLensWebsite() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { isEmployeeLoggedIn, logoutEmployee } = useEmployeeAuth();

  const goTo = (path) => {
    navigate(path);
  };

  const [showProducts, setShowProducts] = useState(false);
  const [open, setOpen] = useState(false);

  const scrollToHomeSection = (sectionId) => {
    setOpen(false);
    setShowProducts(false);
    const el = () => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    if (window.location.pathname === "/") {
      el();
    } else {
      navigate("/");
      window.setTimeout(el, 250);
    }
  };

  return (
    <div className="relative min-h-screen text-white">
    <HomePageBackground />
      <div className="relative z-10">
        <header className="sticky top-0 z-50 py-4 backdrop-blur-xl bg-black/30 border-b border-white/10">
  <div className="w-full grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 sm:gap-3 sm:px-6 md:px-10 lg:px-20 xl:px-28">
    <div className="flex h-14 min-w-0 shrink-0 items-center justify-start overflow-visible sm:h-14">
      <img
        src={siteLogo}
        alt="The EchoMinds Logo"
        width={112}
        height={112}
        decoding="async"
        className="h-14 w-14 shrink-0 object-contain object-left scale-[1.42] origin-left sm:h-14 sm:w-14 sm:scale-[1.55] ml-0.5 sm:ml-0 will-change-transform"
      />
    </div>

    <div className="flex flex-wrap items-center justify-center gap-2">
      {isEmployeeLoggedIn && (
        <>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-cyan-500/40 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-950/40"
            onClick={() => {
              setOpen(false);
              setShowProducts(false);
              navigate("/admin");
            }}
          >
            Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-white/20 px-4 py-2 text-sm text-zinc-300"
            onClick={() => {
              setOpen(false);
              setShowProducts(false);
              logoutEmployee(navigate);
            }}
          >
            Work logout
          </Button>
        </>
      )}
    </div>

    <div className="flex items-center justify-end gap-2 sm:gap-3">
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setShowProducts(false);
          navigate("/dashboard");
        }}
        className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition"
        aria-label="Open profile and dashboard"
      >
        <User size={20} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition"
        aria-expanded={open}
        aria-label="Open menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>
  </div>

  {open && (
    <div className="absolute right-6 mt-4 w-[min(100vw-3rem,16rem)] sm:w-56 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-3 flex flex-col gap-2 shadow-2xl">
      <button
        onClick={() => {
          navigate("/dashboard");
          setOpen(false);
        }}
        className="text-left px-4 py-2 rounded-lg hover:bg-white/10"
      >
        My Profile
      </button>
      <button
        onClick={() => scrollToHomeSection("features")}
        className="text-left px-4 py-2 rounded-lg hover:bg-white/10"
      >
        Features
      </button>

      <div className="relative">
        <button
          onClick={() => setShowProducts((prev) => !prev)}
          className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
        >
          Product
        </button>

        {showProducts && (
          <div className="mt-2 w-full rounded-xl bg-black/70 backdrop-blur-md border border-white/10 overflow-hidden">
            <button
              onClick={() => scrollToHomeSection("product-g1")}
              className="block w-full text-left px-4 py-2 hover:bg-white/10"
            >
              EchoLens G.1
            </button>

            <button
              onClick={() => scrollToHomeSection("product-s1")}
              className="block w-full text-left px-4 py-2 hover:bg-white/10"
            >
              EchoLens S.1
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          navigate("/play");
          setOpen(false);
        }}
        className="text-left px-4 py-2 rounded-lg hover:bg-white/10"
      >
        Echo-App
      </button>

      <button
        onClick={() => {
          navigate("/help-centre");
          setOpen(false);
        }}
        className="text-left px-4 py-2 rounded-lg hover:bg-white/10"
      >
        Help Centre
      </button>

      <button
        onClick={() => {
          navigate("/support");
          setOpen(false);
        }}
        className="text-left px-4 py-2 rounded-lg hover:bg-white/10"
      >
        Support
      </button>

      <button
        onClick={() => scrollToHomeSection("blogs")}
        className="text-left px-4 py-2 rounded-lg hover:bg-white/10"
      >
        Blogs
      </button>

      <button
        onClick={() => {
          navigate("/about");
          setOpen(false);
        }}
        className="text-left px-4 py-2 rounded-lg hover:bg-white/10"
      >
        About
      </button>

      <button
        onClick={() => {
          navigate("/company-investor-relations");
          setOpen(false);
        }}
        className="text-left px-4 py-2 rounded-lg hover:bg-white/10"
      >
        Company and Investor Relations
      </button>

      <button
        onClick={() => {
          navigate("/employee-login");
          setOpen(false);
        }}
        className="text-left px-4 py-2 rounded-lg hover:bg-white/10"
      >
        Employee Login
      </button>

      {isLoggedIn && (
        <button
          onClick={() => {
            logout(navigate);
            setOpen(false);
          }}
          className="text-left px-4 py-2 rounded-lg hover:bg-white/10 text-red-400"
        >
          Logout
        </button>
      )}
    </div>
  )}
</header>
 <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center max-w-4xl px-6"
          >
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">EchoLens</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">AI smart glasses by TheEchoMinds</p>
            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="rounded-full px-8 py-6 text-base" onClick={() => goTo("/product-2")}>
                  Order now
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-6 text-base"
                  onClick={() => goTo("/how-it-works")}
                >
                  See how it works
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <FeatureShowcase />

        <ProductShowcase />

        <HomePublicGallery sectionId="home-gallery" title="Gallery" accent="cyan" />

        <BlogSection />

        <section
          id="company-investor"
          className="py-20 sm:py-28 px-4 sm:px-6 scroll-mt-24 border-t border-white/5"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 sm:p-10 md:p-12 text-center sm:text-left"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
            >
              <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/80 mb-3">
                TheEchoMinds Pvt. Ltd. · The EchoMinds
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight">
                Company &amp; investor relations
              </h2>
              <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-2xl sm:max-w-3xl mx-auto sm:mx-0">
                Corporate profile, registered office details, and a channel for investor and partnership inquiries—plus
                where to find our public policies.
              </p>
              <div className="mt-8 flex justify-center sm:justify-start">
                <Button className="rounded-full px-8 py-6 text-base" onClick={() => goTo("/company-investor-relations")}>
                  View company &amp; IR page
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-32 px-6 text-center">
          <motion.h2 className="text-3xl font-medium mb-4">Get early access</motion.h2>
          <motion.p className="text-gray-400 mb-10">Join the waitlist for EchoLens.</motion.p>
          <motion.div className="flex justify-center gap-3 max-w-md mx-auto">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 rounded-full px-5 py-3 text-black"
            />
            <Button className="rounded-full px-6" onClick={() => goTo("/preorder")}>
              Join
            </Button>
          </motion.div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}