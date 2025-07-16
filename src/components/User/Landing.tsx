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
          backgroundImage: `url('https://lh3.googleusercontent.com/bW_b4ccW3Y-5lIKWK-6mD7jy--hybcLAyd12YMIphOYIWOEw1aPKW1LSCcGkBBL_UPofwSxXaHKVGNOugeVKUdWjoPp2KpXCgKxtGns=w1200-h800-l90-rw-e30')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="container relative z-10 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Professional Photography Collaboration Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white">
              BellaImagine bridges the gap between photographers and clients
              with real-time communication tools
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/vendor/signup")}>
                Join as Photographer
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/photographers")}
              >
                Find Photographers
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Real Community Engagement
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className=" p-6 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-pink-600 mr-3"></div>
                <div>
                  <h3 className="font-bold">PhotographerPro</h3>
                  <p className="text-sm text-gray-400">Posted 3 hours ago</p>
                </div>
              </div>
              <img
                src="https://lh3.googleusercontent.com/5YpOstgjQJgyxn1_z9wPrzamPbkE574bvDZUi1_6Wb2ZjDSlq8QO6kWv5JouufqcZcaE_Ai5ffzrYiYyqFYEfA5mvC_Xxx8ttDq7-w=w1200-h800-l90-rw-e30"
                alt="Community post"
                className="w-full rounded-lg mb-4"
              />
              <div className="flex items-center justify-between text-gray-300">
                <div className="flex space-x-4">
                  <button className="flex items-center hover:text-pink-500">
                    {/* <FaHeart className="mr-1" /> 124 */}
                  </button>
                  <button className="flex items-center hover:text-pink-500">
                    {/* <FaComments className="mr-1" /> 18 */}
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  #WeddingPhotography
                </span>
              </div>
            </div>

            <div>
              <div className=" p-6 rounded-xl border border-gray-700 mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 mr-2"></div>
                  <span className="font-medium">TravelShooter</span>
                </div>
                <p className="mb-3">
                  Looking for recommendations on the best portable lighting
                  setup for outdoor shoots in Mumbai monsoon season?
                </p>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="mr-3">7 likes</span>
                  <span>4 comments</span>
                </div>
              </div>

              <div className=" p-6 rounded-xl border border-gray-700 mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 mr-2"></div>
                  <span className="font-medium">StreetView_India</span>
                </div>
                <p className="mb-3">
                  Just completed this urban portrait series in Delhi. Would love
                  feedback on the color grading approach!
                </p>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="mr-3">23 likes</span>
                  <span>9 comments</span>
                </div>
              </div>

              <div className=" p-6 rounded-xl border border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-600 mr-2"></div>
                  <span className="font-medium">NewbiePhotog</span>
                </div>
                <p className="mb-3">
                  Contest announcement: "Golden Hour Challenge" - submit your
                  best golden hour shots for a chance to be featured!
                </p>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="mr-3">56 likes</span>
                  <span>12 comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t ">
        {/* Final CTA Section */}
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 ">
            Ready to Transform Your Photography Experience?
          </h2>
          <p className="text-xl mb-8 dark:text-gray-300 text-gray-600">
            Join thousands of photographers and clients creating amazing visuals
            together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-orange-700 hover:bg-orange-800 transition-colors"
            >
              Get Started - It's Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/photographers")}
            >
              Explore Photographers
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
