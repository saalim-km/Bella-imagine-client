"use client";

import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <h3 className="font-serif text-2xl">BellaImagine</h3>
            <p className="text-white/60 max-w-xs">
              A curated platform connecting visionary photographers with clients seeking artistic excellence.
            </p>
            <div className="flex gap-6">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label={`Social media link ${i + 1}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest">Navigation</h4>
            <nav className="flex flex-col gap-3">
              {["Portfolio", "Photographers", "Journal", "About"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-white/60 hover:text-white transition-colors inline-flex items-center group"
                >
                  <span>{item}</span>
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest">Legal</h4>
            <nav className="flex flex-col gap-3">
              {["Terms", "Privacy", "Cookies", "Licensing"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-white/60 hover:text-white transition-colors inline-flex items-center group"
                >
                  <span>{item}</span>
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest">Contact</h4>
            <p className="text-white/60">
              saalimkm@gmail.com
              <br />
              +91 9895012661
            </p>
            <a
              href="/contact"
              className="font-serif inline-block px-6 py-3 border border-white/20 text-white text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-white/40">© {new Date().getFullYear()} BellaImagine. All rights reserved.</p>
          <p className="text-sm text-white/40">Crafted with precision for the visionary photographer</p>
        </motion.div>
      </div>
    </footer>
  );
}