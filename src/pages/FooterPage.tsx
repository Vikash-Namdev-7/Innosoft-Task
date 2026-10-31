import { Link } from "react-router-dom";
import { footerPages } from "@/data/footer-pages";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Rejection & Decline", href: "/rejection-decline" },
  { label: "Responsible Gaming", href: "/responsible-gaming" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

export default function FooterPage() {
  return (
    <footer className="w-full overflow-hidden bg-[#05080d] text-white mt-5">
      {/* Support Banner */}
      <section className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-[#08bba5] to-[#05708f] px-2 py-3 text-center">
        <h2 className="text-[12px] font-medium leading-relaxed sm:text-md ">
          Need Help? Our 24/7 Support Team Is Here For You Anytime!
        </h2>

        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact support on WhatsApp"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform duration-200 hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M20.5 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20l1.2-4.9a8.4 8.4 0 1 1 16.3-3.6Z" />
            <path d="M8.5 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.7 1.2 1.7 2.1 3 2.7.3.1.5.1.7-.1l.8-1c.2-.2.4-.3.7-.1l1.7.8c.3.2.4.3.4.5 0 .3-.2 1.1-.7 1.5-.5.5-1.2.7-1.9.7-.7 0-1.5-.2-2.3-.5-1.3-.5-2.5-1.4-3.6-2.5-1.1-1.1-1.8-2.4-2-3.4-.2-.9 0-1.7.4-2.3Z" />
          </svg>
        </a>
      </section>

      {/* Footer Content */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Description */}
        <p className="mx-auto max-w-[1400px] py-4 text-center text-[12px] text-[#8795aa] sm:py-7 ">
          KailashBook delivers a fast, secure, and skill-focused gaming
          experience across casino challenges and sports contests. With a wide
          range of trusted payment options, our platform ensures quick, smooth
          deposits and withdrawals—so you can stay focused on strategy,
          competition, and winning. Seamless transactions. Real competition.
          Pure performance.
        </p>

        {/* Navigation Links */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-7 gap-y-4 pb-7 pt-2 sm:gap-x-8 md:gap-x-10"
        >
          {footerPages.map((page) => (
            <Link
              key={page.slug}
              to={`/${page.slug}`}
              className="text-[13px] group flex items-center gap-2 text-white transition-colors duration-200 hover:text-[#08bba5] "
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#505968] transition-colors duration-200 group-hover:bg-[#08bba5]" />
              <span>{page.label}</span>
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px w-full bg-[#363c45]" />

        {/* Copyright */}
        <div className="px-2 py-7 text-center sm:py-8">
          <p className="text-[12px] leading-7 text-[#8795aa] mb-6">
            © Copyright 2024. All Rights Reserved. Powered by{" "}
            <Link
              to="/home"
              className="font-semibold transition-colors hover:text-white"
            >
              KailashBook.
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
