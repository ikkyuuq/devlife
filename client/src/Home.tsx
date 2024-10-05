import { Button } from "@/components/ui/button";
import { Code, Terminal, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import bgDevlifeDesktop from "./assets/bg-devlife-desktop.mp4";
import bgDevlifeMobile from "./assets/bg-devlife-mobile.mp4";

export const Home = () => {
  return (
    <div>
      <section
        className="relative h-screen flex flex-col justify-center gap-12 items-center w-full"
        id="devlife"
      >
        <video
          id="bg-video-desktop"
          className="hidden lg:block absolute top-0 left-0 w-full h-full object-fill"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={bgDevlifeDesktop} type="video/mp4" />
        </video>
        <video
          id="bg-video-mobile"
          className="lg:hidden absolute top-0 left-0 w-full h-full object-fill"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={bgDevlifeMobile} type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black sm:bg-opacity-50 bg-opacity-10 sm:backdrop-blur-none backdrop-blur-sm transition-all duration-500"></div>
        <div className="max-w-7xl w-full grid grid-cols-1 mx-auto gap-8 lg:gap-12 px-4 lg:px-6 relative z-10">
          <div className="text-zinc-50">
            <div className="transition-all duration-500 flex flex-col w-full max-w-xl lg:max-w-2xl gap-4 lg:gap-6 mx-auto text-center">
              <h1 className="lg:text-7xl sm:text-5xl text-4xl transition-all duration-300 font-bold">
                Better for
                <br />
                <span className="text-green-300 bg-gradient-to-r from-green-300 to-green-500 text-transparent bg-clip-text">
                  {"{developer}. "}
                </span>
                Future
                <br /> for everyone.
              </h1>
              <p className="text-sm sm:text-base lg:text-lg">
                A new way to learn and enhance your programming skills, expand
                your knowledge with{" "}
                <span className="italic">"your own favorite IDE"</span>.
              </p>
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  className="text-sm sm:text-base lg:text-lg py-2 px-4 sm:py-3 sm:px-6 lg:py-6 lg:px-10"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="min-h-screen py-28 px-4 lg:px-6" id="features">
        <h1 className="text-zinc-50 text-4xl font-bold mb-12 text-center">
          Features
        </h1>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-zinc-800 border-zinc-700 shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Code className="text-green-300" size={28} />
                  <CardTitle className="text-green-300 text-2xl">
                    Use your own IDE for coding
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300">
                  Enjoy the comfort of your familiar development environment
                  while learning and improving your skills.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-800 border-zinc-700 shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Terminal className="text-green-300" size={28} />
                  <CardTitle className="text-green-300 text-2xl">
                    Submit tasks with CLI tools
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300">
                  Utilize our "Devlife" command-line interface for seamless task
                  submission and management.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-800 border-zinc-700 shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <PlusCircle className="text-green-300" size={28} />
                  <CardTitle className="text-green-300 text-2xl">
                    Create your own challenges
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300">
                  Design and share custom tasks to challenge other developers
                  and foster a collaborative learning environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
