import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { UseFormReturn } from "react-hook-form";
import { AuthFormData } from "../schemas/authSchema";

interface SignFormProps {
  form: UseFormReturn<AuthFormData>;
  onSubmit: (values: AuthFormData) => void;
  sign: "in" | "up";
}

function SignForm({ form, onSubmit, sign }: SignFormProps) {
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Button className="w-full" type="submit">
            Sign {sign}
          </Button>
          {sign === "in" ? (
            <span className="text-zinc-900 hover:text-zinc-700 underline text-sm text-center block cursor-pointer transition-colors">
              Forgot your password?
            </span>
          ) : null}
        </div>
      </form>
    </Form>
  );
}

export default SignForm;
