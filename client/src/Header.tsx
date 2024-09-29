import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthDialog from "@/components/AuthDialog";
import { AuthFormData, authSchema } from "@/schemas/authSchema";

export const Header = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInSubmit = (values: AuthFormData) => {
    console.log(values);
  };
  const onSignUpSubmit = (values: AuthFormData) => {
    console.log(values);
  };

  const onVerificationSubmit = (code: string) => {
    console.log(code);
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
        <AuthDialog
          form={form}
          onSignInSubmit={onSignInSubmit}
          onSignUpSubmit={onSignUpSubmit}
          onVerificationSubmit={onVerificationSubmit}
        />
      </div>
    </nav>
  );
};
