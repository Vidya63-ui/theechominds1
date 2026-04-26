import PageBackground from "@/components/PageBackground.jsx";
import SiteFooter from "@/components/SiteFooter.jsx";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LAST_UPDATED = "April 25, 2026";

function PolicyDocLayout({ title, children }) {
  return (
    <div className="relative min-h-screen text-white">
      <PageBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteSubpageHeader />

        <article className="py-12 sm:py-16 px-4 sm:px-6 flex-1">
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
              className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 md:p-10 space-y-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{title}</h1>
              <p className="text-gray-500 text-sm border-b border-white/10 pb-4">
                Last updated: {LAST_UPDATED} · TheEchoMinds Pvt. Ltd. (The EchoMinds)
              </p>
              <div className="space-y-4 text-sm md:text-base text-gray-300 leading-relaxed">{children}</div>
            </motion.div>
            <p className="text-center text-sm">
              <Link to="/" className="text-gray-500 hover:text-white hover:underline">
                Back to home
              </Link>
            </p>
          </div>
        </article>

        <SiteFooter className="mt-auto" />
      </div>
    </div>
  );
}

export function TermsOfUsePage() {
  return (
    <PolicyDocLayout title="Terms of Use">
      <p>These terms govern your use of The EchoMinds website, the EchoLens mobile app, and related preorder and support services. By using our services, you agree to these terms.</p>
      <h2 className="text-lg font-semibold text-white pt-2">Use of service</h2>
      <ul className="list-disc list-inside space-y-2 pl-0.5">
        <li>You must provide accurate information for accounts, preorders, and support requests.</li>
        <li>You are responsible for maintaining the confidentiality of your account and for all activity under it.</li>
        <li>We may change features, prices, and availability; material changes will be reflected on this site or in-app where appropriate.</li>
      </ul>
      <h2 className="text-lg font-semibold text-white pt-2">Product &amp; software</h2>
      <p>
        Hardware and software for EchoLens are provided subject to the applicable{" "}
        <Link to="/warranty-policy" className="text-white underline-offset-2 hover:underline">
          warranty
        </Link>{" "}
        and our{" "}
        <Link to="/privacy-policy" className="text-white underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        . AI and cloud features may require internet access and a compatible device.
      </p>
      <h2 className="text-lg font-semibold text-white pt-2">Limitation of liability</h2>
      <p>
        To the extent permitted by law, TheEchoMinds Pvt. Ltd. is not liable for indirect or consequential losses. Our total liability for a claim related to a specific order is limited to the amount you paid to us for that
        product or service, except where the law does not allow such a cap.
      </p>
      <h2 className="text-lg font-semibold text-white pt-2">Governing law</h2>
      <p>These terms are governed by the laws of India. Courts at Hyderabad, Telangana shall have exclusive jurisdiction, subject to applicable consumer rights in your state or country.</p>
      <p>
        <strong className="text-white">Contact:</strong>{" "}
        <a className="text-white underline" href="mailto:contact@theechominds.com">
          contact@theechominds.com
        </a>
      </p>
    </PolicyDocLayout>
  );
}

export function WarrantyPolicyPage() {
  return (
    <PolicyDocLayout title="Warranty Policy">
      <p>This limited warranty applies to EchoLens devices sold by TheEchoMinds Pvt. Ltd. (The EchoMinds) in India, subject to the conditions below.</p>
      <h2 className="text-lg font-semibold text-white pt-2">Warranty period</h2>
      <p>Unless stated otherwise on your order or packaging, the hardware is covered by a limited warranty against defects in materials and workmanship for the period specified at the time of purchase (e.g. twelve months from the date of purchase or delivery, as communicated on the invoice or product page).</p>
      <h2 className="text-lg font-semibold text-white pt-2">What is covered</h2>
      <ul className="list-disc list-inside space-y-2 pl-0.5">
        <li>Defects that exist under normal use, in line with the user guide and safety instructions.</li>
        <li>Repair or replacement, at our discretion, of a defective unit or component.</li>
      </ul>
      <h2 className="text-lg font-semibold text-white pt-2">What is not covered</h2>
      <ul className="list-disc list-inside space-y-2 pl-0.5">
        <li>Damage from drops, liquid, unauthorized repair, misuse, or modifications.</li>
        <li>Normal wear, cosmetic issues, and consumable parts unless expressly covered.</li>
        <li>Software issues covered separately through app updates and support channels, except where caused by a hardware defect.</li>
      </ul>
      <h2 className="text-lg font-semibold text-white pt-2">Making a claim</h2>
      <p>Contact us at support@theechominds.com with your proof of purchase, serial or order ID, and a description of the issue. We may require return or inspection before approving repair or replacement. Statutory rights under the Consumer Protection Act, 2019, or other applicable law, remain in addition to this policy.</p>
    </PolicyDocLayout>
  );
}

export function ShippingPolicyPage() {
  return (
    <PolicyDocLayout title="Shipping & delivery">
      <p>
        This policy describes how <strong className="text-white">TheEchoMinds Pvt. Ltd.</strong> (brand:{" "}
        <strong className="text-white">The EchoMinds</strong>) fulfils orders for EchoLens and related accessories sold
        through our official channels. Exact fees, estimated delivery dates, and serviceable pincodes are shown at{" "}
        <strong className="text-white">checkout</strong> before you pay.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Where we ship</h2>
      <p>
        We currently ship to addresses within <strong className="text-white">India</strong> unless a specific campaign
        states otherwise. If your pincode is not serviceable, checkout will indicate this before payment. We do not ship
        to P.O. boxes unless the carrier explicitly supports delivery to that format for your location.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Order processing &amp; dispatch</h2>
      <ul className="list-disc list-inside space-y-2 pl-0.5">
        <li>
          <strong className="text-white">In-stock</strong> orders are typically packed within <strong className="text-white">1–3 business days</strong>{" "}
          after payment confirmation, excluding public holidays and force majeure events.
        </li>
        <li>
          <strong className="text-white">Pre-orders</strong> ship according to the estimated window shown on the product
          or campaign page. You will receive email (and in-app notifications where enabled) when your order moves to
          &quot;packed&quot; or &quot;shipped&quot;.
        </li>
        <li>
          If an item is delayed beyond the communicated window, we will notify you where possible and offer applicable
          remedies under law and our <Link to="/terms-of-use" className="text-white underline-offset-2 hover:underline">Terms of Use</Link>.
        </li>
      </ul>

      <h2 className="text-lg font-semibold text-white pt-2">Carriers, tracking &amp; proof of delivery</h2>
      <p>
        We use reputable third-party couriers. A <strong className="text-white">tracking link or AWB number</strong> is
        shared by email/SMS when the shipment is handed over. Delivery may require an OTP, signature, or handover to an
        adult at the address, per carrier rules. If you are unavailable, the carrier may re-attempt or hold the parcel
        as per their policy; additional charges may apply for extended storage or re-dispatch.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Delivery timelines</h2>
      <p>
        <strong className="text-white">Metro and tier-1</strong> cities often see transit within a few business days
        after dispatch; <strong className="text-white">remote or hilly</strong> regions may take longer. Displayed ETA
        at checkout is indicative and not a guaranteed delivery on a specific calendar hour unless we expressly label it
        as guaranteed (in which case separate terms apply).
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Shipping fees &amp; taxes</h2>
      <p>
        Shipping charges (if any), GST or other applicable taxes, and any cash-on-delivery or convenience fees are
        itemised at checkout. Promotional free shipping applies only to eligible orders during the stated campaign period.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Address accuracy &amp; changes</h2>
      <p>
        You are responsible for a complete, correct delivery address including pincode and reachable phone number.
        Address changes may be possible <strong className="text-white">only before dispatch</strong>; after handover to
        the carrier, changes are subject to the courier&apos;s ability and may incur fees. Contact{" "}
        <a className="text-white underline" href="mailto:support@theechominds.com">support@theechominds.com</a> with your
        order ID for urgent corrections.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Damaged, missing, or wrong items</h2>
      <p>
        If the <strong className="text-white">outer packaging is visibly damaged</strong>, note it with the delivery
        agent where possible and photograph the package before opening. Report missing items, wrong SKUs, or transit
        damage within <strong className="text-white">48 hours</strong> of delivery with photos and your order ID. We
        will assess against carrier records and our{" "}
        <Link to="/warranty-policy" className="text-white underline-offset-2 hover:underline">warranty</Link> / consumer
        obligations.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Returns before use</h2>
      <p>
        Return eligibility for unused products is governed by our sales terms and any return window communicated at
        purchase. Opened software-only purchases may be non-refundable where stated by law or product terms.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Contact</h2>
      <p>
        <strong className="text-white">Shipping &amp; delivery support:</strong>{" "}
        <a className="text-white underline" href="mailto:support@theechominds.com">support@theechominds.com</a>
        <br />
        <strong className="text-white">General:</strong>{" "}
        <a className="text-white underline" href="mailto:contact@theechominds.com">contact@theechominds.com</a>
      </p>
      <p className="text-xs text-gray-500 pt-2">
        For paid pick-up and return of devices for service, see our{" "}
        <Link to="/repair-service-policy" className="text-gray-400 underline-offset-2 hover:underline">
          Door-to-door paid repair &amp; service policy
        </Link>
        .
      </p>
    </PolicyDocLayout>
  );
}

export function RepairServicePolicyPage() {
  return (
    <PolicyDocLayout title="Door-to-door paid repair & service policy">
      <p>
        This policy covers <strong className="text-white">paid repair and maintenance</strong> for EchoLens devices,
        including optional <strong className="text-white">door-to-door logistics</strong> (home or office pick-up and
        return delivery) where we offer that service in your area. It applies in addition to your statutory rights and
        our <Link to="/warranty-policy" className="text-white underline-offset-2 hover:underline">Warranty Policy</Link>{" "}
        for defects covered under warranty (warranty repairs may follow a different process and may not be chargeable).
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">What &quot;door-to-door&quot; means</h2>
      <p>
        Where available, we arrange a <strong className="text-white">courier pick-up</strong> from your registered
        address (or another agreed serviceable address), transport to our authorised service partner or service centre,
        and <strong className="text-white">return shipment</strong> after repair. Pick-up and delivery windows are
        communicated by SMS/email and depend on third-party carriers; we do not guarantee a specific hour unless
        explicitly confirmed in writing for your ticket.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Eligibility</h2>
      <ul className="list-disc list-inside space-y-2 pl-0.5">
        <li>Service is offered for genuine EchoLens units sold through official channels, subject to spare-part availability.</li>
        <li>
          <strong className="text-white">Out-of-warranty</strong> work (accidental damage, liquid, wear, expired
          warranty) is typically <strong className="text-white">paid</strong>. Warranty claims are assessed separately
          under the warranty policy.
        </li>
        <li>We may refuse service for tampered, counterfeit, or unsafe devices, or where required parts are discontinued.</li>
      </ul>

      <h2 className="text-lg font-semibold text-white pt-2">How to request door-to-door service</h2>
      <ol className="list-decimal list-inside space-y-2 pl-0.5">
        <li>
          Email <a className="text-white underline" href="mailto:support@theechominds.com">support@theechominds.com</a>{" "}
          with subject line <strong className="text-white">&quot;Repair — door to door&quot;</strong>, including: your
          name, phone, full address with pincode, order or serial reference, and a short description of the issue
          (photos/video if safe to share).
        </li>
        <li>
          We issue a <strong className="text-white">service reference (ticket) ID</strong> and instructions for
          packaging. Use the original or equivalent rigid packaging where possible; inadequate packing may void transit
          protection offered by the logistics partner.
        </li>
        <li>
          After the device is received and <strong className="text-white">diagnosed</strong>, we send a written estimate:
          parts, labour, taxes, and <strong className="text-white">logistics fees</strong> (pick-up + return) if
          applicable. <strong className="text-white">No billable repair begins</strong> without your approval of the
          estimate (and payment of any required advance).
        </li>
        <li>
          On completion, we ship the device to the return address on the ticket, or arrange handover where offered. A
          job summary and any limited warranty on the repair work will be communicated with the shipment.
        </li>
      </ol>

      <h2 className="text-lg font-semibold text-white pt-2">Data &amp; privacy before you send the device</h2>
      <p>
        You should <strong className="text-white">back up and remove personal data</strong> where the product allows it.
        We may need to reset or reflash software as part of diagnosis or repair. We treat devices in line with our{" "}
        <Link to="/privacy-policy" className="text-white underline-offset-2 hover:underline">Privacy Policy</Link>; we do
        not browse your private content except as needed to verify reported defects, with your consent where feasible.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Turnaround &amp; delays</h2>
      <p>
        Repair time depends on diagnosis, parts sourcing, and testing. We aim to communicate revised timelines if a delay
        exceeds the initial estimate. We are not liable for delays caused by parts unavailability, carrier disruptions,
        or events outside our reasonable control.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Transit, insurance &amp; risk</h2>
      <p>
        Logistics is performed by <strong className="text-white">independent carriers</strong>. Condition on inbound
        receipt is logged (e.g. photos, checklist). Risk allocation for loss or damage in transit follows the booking
        terms with that carrier and applicable law. Where optional transit insurance is offered, its scope and limits
        will be stated on the estimate.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Charges &amp; payments</h2>
      <p>
        You agree to pay quoted amounts for approved repairs, parts, and logistics before we release the shipment (or as
        otherwise stated on your invoice). If you <strong className="text-white">decline</strong> the estimate after
        diagnosis, you may be charged a <strong className="text-white">diagnostic or handling fee</strong> and return
        logistics as communicated in advance. Unclaimed devices beyond the stated storage period may incur storage fees
        or be disposed of in line with law after reasonable notice.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Warranty on repair work</h2>
      <p>
        Repaired or replaced components may carry a <strong className="text-white">limited workmanship / parts warranty</strong>{" "}
        (duration stated on your job sheet). This does not extend unrelated original warranty coverage for other
        components. Cosmetic changes from repair are not defects unless agreed otherwise.
      </p>

      <h2 className="text-lg font-semibold text-white pt-2">Contact</h2>
      <p>
        <strong className="text-white">Repairs &amp; door-to-door service:</strong>{" "}
        <a className="text-white underline" href="mailto:support@theechominds.com">support@theechominds.com</a>
        <br />
        <strong className="text-white">Order shipping (new products):</strong> see our{" "}
        <Link to="/shipping-policy" className="text-white underline-offset-2 hover:underline">Shipping &amp; delivery</Link>{" "}
        policy.
      </p>
    </PolicyDocLayout>
  );
}
