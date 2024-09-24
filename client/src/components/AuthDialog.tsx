import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import SignForm from "./SignForm";
import { AuthFormData } from "@/schemas/authSchema";
import { UseFormReturn } from "react-hook-form";

interface AuthDialogProps {
  form: UseFormReturn<AuthFormData>;
  onSignInSubmit: (values: AuthFormData) => void;
  onSignUpSubmit: (values: AuthFormData) => void;
}

function AuthDialog({ form, onSignInSubmit, onSignUpSubmit }: AuthDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Sign in</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl text-center">
            Devlife Authentication
          </DialogTitle>
          <DialogDescription className="text-center">
            Welcome to Devlife! Sign in or sign up to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <Button className="w-full space-x-2">
            <span>Continue with Github</span>
            <Github />
          </Button>
        </div>
        <div>
          <Tabs defaultValue="signin">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignForm sign="in" form={form} onSubmit={onSignInSubmit} />
            </TabsContent>
            <TabsContent value="signup">
              <SignForm sign="up" form={form} onSubmit={onSignUpSubmit} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthDialog;
