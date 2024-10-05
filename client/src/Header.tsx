import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthDialog from "@/components/AuthDialog";
import { AuthFormData, authSchema } from "@/schemas/authSchema";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkSignInStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/signin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setIsSignedIn(!data.isAvailable);
      } catch (error) {
        console.error("Error checking sign-in status:", error);
        setIsSignedIn(false);
      }
    };

    checkSignInStatus();
  }, [isSignedIn]);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInSubmit = async (values: AuthFormData) => {
    try {
      await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });
      setIsSignedIn(true);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };
  const onSignUpSubmit = async (values: AuthFormData) => {
    try {
      await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const onSignOut = async () => {
    try {
      await fetch("http://localhost:3000/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setIsSignedIn(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const onVerificationSubmit = async (code: string) => {
    const res = await fetch("http://localhost:3000/email-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
      credentials: "include",
    });
    return res.status;
  };

  return (
    <nav className="z-20 fixed top-0 left-0 right-0 mx-auto w-full max-w-7xl flex justify-between items-center py-4 lg:px-6 px-8">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-sky-300 text-transparent bg-clip-text">
          <a href={isRoot ? "#devlife" : "/#devlife"}>Devlife</a>
        </h1>
      </div>
      <div className="flex-grow">
        <ul className="flex gap-6 justify-center text-zinc-50">
          <li>
            <a href="/explore">Explore</a>
          </li>
          <li>
            <a href="/roadmaps">Roadmaps</a>
          </li>
          <li>
            <a href={isRoot ? "#features" : "/#features"}>Features</a>
          </li>
        </ul>
      </div>
      <div className="flex gap-4">
        {isSignedIn ? (
          <Button
            variant="secondary"
            onClick={() => {
              onSignOut();
            }}
          >
            Sign Out
          </Button>
        ) : (
          <AuthDialog
            form={form}
            onSignInSubmit={onSignInSubmit}
            onSignUpSubmit={onSignUpSubmit}
            onVerificationSubmit={onVerificationSubmit}
            setIsSignedIn={setIsSignedIn}
          />
        )}
      </div>
    </nav>
  );
};
