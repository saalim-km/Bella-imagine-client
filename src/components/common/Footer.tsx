"use client";

import { Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" border-t  py-8">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4">
        {/* Social Links */}
        <div className="flex gap-4">
          <a
            href="https://www.instagram.com/sa.liim__/"
            className=" "
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/salim-k-m-3ab7ba246/"
            className=" "
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
        {/* Copyright */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} BellaImagine Community
        </p>
      </div>
    </footer>
  );
}