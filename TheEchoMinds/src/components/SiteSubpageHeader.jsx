import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.jsx";
import { useEmployeeAuth } from "@/context/EmployeeAuthContext.jsx";
import { Menu, X } from "lucide-react";

const headerBar =
  "sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-md shrink-0";

/**
 * Public subpages: only Home + burger in the bar; full links live in the menu.
 *
 * @param {object} props
 * @param {import("react").ReactNode} [props.leading]
 * @param {string} [props.innerClassName] Max width utility, default `max-w-6xl` (e.g. `max-w-4xl`).
 * @param {string} [props.headerClassName]
 */
export default function SiteSubpageHeader({
  leading,
  innerClassName = "max-w-6xl",
  headerClassName = "",
}) {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { isEmployeeLoggedIn, logoutEmployee } = useEmployeeAuth();
  const [open, setOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  const close = () => {
    setOpen(false);
    setShowProducts(false);
  };

  const scrollToHomeSection = (sectionId) => {
    close();
    const el = () => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    if (window.location.pathname === "/") {
      el();
    } else {
      navigate("/");
      window.setTimeout(el, 250);
    }
  };

  const defaultLeading = (
    <h1 className="text-lg md:text-xl font-semibold tracking-wide text-white">The EchoMinds</h1>
  );

  return (
    <header className={`${headerBar} relative ${headerClassName}`.trim()}>
      <div
        className={`mx-auto flex w-full items-center justify-between gap-2 px-4 py-4 sm:gap-3 sm:px-6 ${innerClassName}`.trim()}
      >
        <div className="min-w-0">{leading != null ? leading : defaultLeading}</div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button type="button" variant="outline" className="rounded-full" onClick={() => navigate("/")}>
            Home
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-white/20 p-2 transition hover:bg-white/10"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute right-4 top-full z-50 mt-1 w-[min(100vw-2rem,16rem)] rounded-2xl border border-white/10 bg-black/70 p-3 shadow-2xl backdrop-blur-xl sm:right-6 sm:w-56">
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard");
              close();
            }}
            className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10"
          >
            My Profile
          </button>
          <button
            type="button"
            onClick={() => scrollToHomeSection("features")}
            className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10"
          >
            Features
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProducts((p) => !p)}
              className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10"
            >
              Product
            </button>
            {showProducts && (
              <div className="mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-black/80 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => scrollToHomeSection("product-g1")}
                  className="block w-full px-4 py-2 text-left hover:bg-white/10"
                >
                  EchoLens G.1
                </button>
                <button
                  type="button"
                  onClick={() => scrollToHomeSection("product-s1")}
                  className="block w-full px-4 py-2 text-left hover:bg-white/10"
                >
                  EchoLens S.1
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              navigate("/play");
              close();
            }}
            className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10"
          >
            Echo-App
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/help-centre");
              close();
            }}
            className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10"
          >
            Help Centre
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/support");
              close();
            }}
            className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10"
          >
            Support
          </button>
          <button
            type="button"
            onClick={() => scrollToHomeSection("blogs")}
            className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10"
          >
            Blogs
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/about");
              close();
            }}
            className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/company-investor-relations");
              close();
            }}
            className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10"
          >
            Company and Investor Relations
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/employee-login");
              close();
            }}
            className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10"
          >
            Employee Login
          </button>

          {isEmployeeLoggedIn && (
            <>
              <div className="my-2 border-t border-white/10" />
              <button
                type="button"
                onClick={() => {
                  close();
                  navigate("/admin");
                }}
                className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10 text-cyan-200"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  close();
                  navigate("/echospace");
                }}
                className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10 text-cyan-200"
              >
                EchoSpace
              </button>
              <button
                type="button"
                onClick={() => {
                  close();
                  logoutEmployee(navigate);
                }}
                className="w-full rounded-lg px-4 py-2 text-left hover:bg-white/10 text-zinc-300"
              >
                Work logout
              </button>
            </>
          )}

          {isLoggedIn && (
            <button
              type="button"
              onClick={() => {
                logout(navigate);
                close();
              }}
              className="mt-1 w-full rounded-lg px-4 py-2 text-left text-red-400 hover:bg-white/10"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
