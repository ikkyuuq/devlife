import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthDialog from "@/components/AuthDialog";
import { AuthFormData, authSchema } from "@/schemas/authSchema";
import { useEffect, useState } from "react";

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
        setIsSignedIn(response.status === 400);
      } catch (error) {
        console.error("Error checking sign-in status:", error);
        setIsSignedIn(true);
      }
    };

    checkSignInStatus();
  }, []);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInSubmit = async (values: AuthFormData) => {
    await fetch("http://localhost:3000/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
      credentials: "include",
    });
  };
  const onSignUpSubmit = async (values: AuthFormData) => {
    await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
      credentials: "include",
    });
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
    <nav className="fixed top-0 left-0 right-0 mx-auto w-full max-w-7xl flex justify-between items-center py-4">
      <div>
        <h1 className="text-xl text-zinc-50 font-bold">
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
          <button
            onClick={() => {
              /* Add sign out logic here */
            }}
          >
            Sign Out
          </button>
        ) : (
          <AuthDialog
            form={form}
            onSignInSubmit={onSignInSubmit}
            onSignUpSubmit={onSignUpSubmit}
            onVerificationSubmit={onVerificationSubmit}
          />
        )}
      </div>
    </nav>
  );
};
