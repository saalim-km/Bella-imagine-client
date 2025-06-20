"use client";

import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black text-white py-12"
    >
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand & Socials */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <h3 className="font-serif text-2xl">BellaImagine</h3>
          <div className="flex gap-4">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-300"
                aria-label={`Social media link ${i + 1}`}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Essential Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm uppercase tracking-widest">
          {["Portfolio", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase()}`}
              className="relative text-white/60 hover:text-white transition-colors duration-300 group"
            >
              {item}
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <a
            href="/privacy"
            className="relative text-white/60 hover:text-white transition-colors duration-300 group"
          >
            Privacy
            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
          </a>
        </nav>
      </div>

      <div className="container mx-auto px-6 mt-8 flex justify-center">
        <p className="text-sm text-white/40 text-center">
          © {new Date().getFullYear()} BellaImagine. Crafted for visionaries.
        </p>
      </div>
    </motion.footer>
  );
}