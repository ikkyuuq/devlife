import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import SignForm from "./SignForm";
import { AuthFormData } from "@/schemas/authSchema";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

interface AuthDialogProps {
  form: UseFormReturn<AuthFormData>;
  onSignInSubmit: (values: AuthFormData) => void;
  onSignUpSubmit: (values: AuthFormData) => void;
  onVerificationSubmit: (code: string) => Promise<boolean>;
}

function AuthDialog({
  form,
  onSignInSubmit,
  onSignUpSubmit,
  onVerificationSubmit,
}: AuthDialogProps) {
  const [showVerification, setShowVerification] = useState(false);
  const [value, setValue] = useState("");

  return (
    <>
      {/* Main Sign Dialog */}
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
                <SignForm
                  sign="up"
                  form={form}
                  onSubmit={(values) => {
                    onSignUpSubmit(values);
                    setShowVerification(true); // Show verification dialog after sign up
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog open={showVerification} onOpenChange={setShowVerification}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()} // Prevents closing on clicking outside
          onEscapeKeyDown={(e) => e.preventDefault()} // Prevents closing on escape
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              Enter Verification Code
            </DialogTitle>
            <DialogDescription>
              Please enter the verification code sent to your email.
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full justify-center">
            <InputOTP
              className="w-full"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={value}
              onChange={(value) => setValue(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AuthDialog;
