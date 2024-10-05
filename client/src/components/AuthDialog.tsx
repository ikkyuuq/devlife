import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogFooter,
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
  onVerificationSubmit: (code: string) => Promise<number>;
  setIsSignedIn: (isSignedIn: boolean) => void;
}

function AuthDialog({
  form,
  onSignInSubmit,
  onSignUpSubmit,
  onVerificationSubmit,
  setIsSignedIn,
}: AuthDialogProps) {
  const [showVerification, setShowVerification] = useState(false);
  const [code, setCode] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [isCodeValid, setIsCodeValid] = useState(true);

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
                <SignForm
                  sign="in"
                  form={form}
                  onSubmit={(values) => {
                    onSignInSubmit(values);
                  }}
                />
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
            <DialogTitle className="text-center text-2xl">
              Please check your email
            </DialogTitle>
            <DialogDescription className="grid grid-cols-1 text-center">
              <span>
                We've sent a code to <strong>{form.getValues("email")}</strong>
              </span>
              <span
                className="text-xs cursor-pointer underline hover:text-zinc-700"
                onClick={() => {
                  setCode("");
                  setShowVerification(false);
                }}
              >
                Change email address
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full justify-center">
            <InputOTP
              className="w-full"
              maxLength={8}
              minLength={8}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={code}
              onChange={(value) => {
                setCode(value);
                setIsCodeValid(true);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className={!isCodeValid ? "border-red-500 text-red-500" : ""}
                />
                <InputOTPSlot
                  index={1}
                  className={!isCodeValid ? "border-red-500 text-red-500" : ""}
                />
                <InputOTPSlot
                  index={2}
                  className={!isCodeValid ? "border-red-500 text-red-500" : ""}
                />
                <InputOTPSlot
                  index={3}
                  className={!isCodeValid ? "border-red-500 text-red-500" : ""}
                />
                <InputOTPSlot
                  index={4}
                  className={!isCodeValid ? "border-red-500 text-red-500" : ""}
                />
                <InputOTPSlot
                  index={5}
                  className={!isCodeValid ? "border-red-500 text-red-500" : ""}
                />
                <InputOTPSlot
                  index={6}
                  className={!isCodeValid ? "border-red-500 text-red-500" : ""}
                />
                <InputOTPSlot
                  index={7}
                  className={!isCodeValid ? "border-red-500 text-red-500" : ""}
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            disabled={code.length >= 8 ? false : true}
            onClick={async (e) => {
              e.preventDefault();
              console.log(`Comfirm with code: ${code}`);
              const res = await onVerificationSubmit(code);
              if (res === 200) {
                setShowVerification(false);
                setIsSignedIn(true);
              } else {
                setIsCodeValid(false);
              }
            }}
          >
            Confirm
          </Button>
          <DialogFooter className="grid grid-cols-1 gap-1 text-center">
            <span className="w-full text-center text-sm text-zinc-500">
              Don't receive an email?{" "}
              <span
                className="cursor-pointer text-zinc-500 font-bold underline hover:text-zinc-700"
                onClick={(e) => {
                  e.preventDefault();
                  if (attempt <= 5) {
                    setAttempt(attempt + 1);
                    console.log("resending email verification code");
                    console.log("attempt: ", attempt);
                  }
                  console.log("Too many attempts. Please try again later.");
                }}
              >
                Resend
              </span>
            </span>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AuthDialog;
