import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Mail, Send } from "lucide-react";

const socialLinks = [
  {
    label: "Email us",
    href: "mailto:contact@theechominds.com",
    Icon: Mail,
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/theechominds",
    Icon: Send,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/theechominds",
    Icon: ExternalLink,
    external: true,
  },
];

const legalLinks = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-of-use", label: "Terms of Use" },
  { to: "/warranty-policy", label: "Warranty Policy" },
  { to: "/shipping-policy", label: "Shipping & delivery" },
  { to: "/repair-service-policy", label: "Door-to-door paid repair & service policy" },
];

/**
 * boAt-style dense footer: social row, policy links, copyright, registered address.
 * Update social `href` values in this file when your official profiles are live.
 */
export default function SiteFooter({ className = "" }) {
  return (
    <footer
      className={`border-t border-zinc-800/90 bg-black/50 backdrop-blur-sm ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 text-left">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Let&apos;s get social
            </h2>
            <p className="text-sm text-gray-400 mb-4 max-w-sm">
              Follow The EchoMinds for product news, behind-the-scenes updates, and support.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/90 transition hover:bg-white/15 hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Legal &amp; policies
            </h2>
            <nav className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-2 sm:gap-y-0 text-sm" aria-label="Legal">
              {legalLinks.map(({ to, label }, i) => (
                <Fragment key={to}>
                  {i > 0 && (
                    <span className="hidden sm:inline text-zinc-600 select-none mx-1.5" aria-hidden>
                      |
                    </span>
                  )}
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-white transition underline-offset-2 hover:underline"
                  >
                    {label}
                  </Link>
                </Fragment>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-800/80 text-xs sm:text-sm text-gray-500 space-y-3 leading-relaxed">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-gray-400">TheEchoMinds Pvt. Ltd.</span> (The EchoMinds). All rights reserved.
          </p>
          <p>
            For queries contact us:{" "}
            <span className="text-gray-400">TheEchoMinds Pvt. Ltd.</span>
            <br />
            Madhapur, Hyderabad, Telangana, India
            <br />
            CIN: U62090TS2026PTC215177
            <br />
            <a
              className="text-gray-400 hover:text-white hover:underline mt-1 inline-block"
              href="mailto:contact@theechominds.com"
            >
              contact@theechominds.com
            </a>
          </p>
          <p>
            <Link to="/" className="text-gray-500 hover:text-white hover:underline">
              theechominds.com
            </Link>{" "}
            — official brand home for EchoLens and related services.
          </p>
        </div>
      </div>
    </footer>
  );
}
