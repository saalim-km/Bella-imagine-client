"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-black"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/deh2nuqeb/image/upload/v1750642868/mywedpic_lkvxug.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="container relative z-10 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Professional Photography Collaboration Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white">
              BellaImagine bridges the gap between photographers and clients with real-time communication tools
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/register")}
              >
                Join as Photographer
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/vendors")}
              >
                Find Photographers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Problem We Solve
            </h2>
            <p className="text-lg mb-12">
              Traditional photography platforms lack real-time collaboration tools, making it difficult for:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4">Photographers</h3>
                <ul className="space-y-3 text-left">
                  <li>• No instant feedback during shoots</li>
                  <li>• Difficulty sharing proofs in real-time</li>
                  <li>• Limited client communication options</li>
                  <li>• No integrated scheduling tools</li>
                </ul>
              </div>
              <div className="p-8 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4">Clients</h3>
                <ul className="space-y-3 text-left">
                  <li>• Can't guide photographers during sessions</li>
                  <li>• Slow proof delivery process</li>
                  <li>• No way to request immediate adjustments</li>
                  <li>• Disconnected booking experience</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Photography Workflow?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the platform built for modern photography professionals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/vendor/signup")}
            >
              Join as Photographer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;