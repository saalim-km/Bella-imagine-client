import { Link } from "react-router-dom";

export default function Footer() {
  
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BellaImagine. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/about" className="hover:underline hover:text-foreground">
            About
          </Link>
          <Link to="/terms" className="hover:underline hover:text-foreground">
            Terms
          </Link>
          <Link to="/privacy" className="hover:underline hover:text-foreground">
            Privacy
          </Link>
          <Link to="https://www.instagram.com/sa.liim__/" className="hover:underline hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
