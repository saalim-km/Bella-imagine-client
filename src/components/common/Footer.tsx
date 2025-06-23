"use client";

import { Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" border-t  py-8">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4">
        {/* Social Links */}
        <div className="flex gap-4">
          <a
            href="#"
            className=" "
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="#"
            className=" "
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="#"
            className=" "
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>

        {/* Minimal Links */}
        <div className="flex gap-6 text-sm ">
          <a href="/about" className="">
            About
          </a>
          <a href="/privacy" className="">
            Privacy
          </a>
          <a href="/terms" className="">
            Terms
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