"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { signIn } from "@/modules/actions/auth";
import { loginSchema, type LoginFormData } from "@/modules/schemas/auth.schema";
import { Button } from "@/modules/components/ui/button";
import { Input } from "@/modules/components/ui/input";
import { Label } from "@/modules/components/ui/label";
import { Alert, AlertDescription } from "@/modules/components/ui/alert";
import { Separator } from "@/modules/components/ui/separator";
import Link from "next/link";
import { createClient } from "@/modules/lib/supabase/client";

interface SignInFormProps {
  onSwitchToSignUp?: () => void;
}

export function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      setError("Failed to sign in with Google");
      setGoogleLoading(false);
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginFormData,
    onSubmit: async ({ value }) => {
      setError("");
      const validation = loginSchema.safeParse(value);
      if (!validation.success) {
        setError(validation.error.issues[0].message);
        return;
      }

      setEmailLoading(true);
      try {
        const result = await signIn(value.email, value.password);
        
        if (result?.error) {
          setError(result.error);
          setEmailLoading(false);
        }
      } catch (err) {
        setError("Invalid email or password");
        setEmailLoading(false);
      }
    },
  });

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight mb-2 text-zinc-950">Sign In</h1>
        <p className="text-sm text-zinc-600">
          Enter your email and password to access your flashcards
        </p>
      </div>

      <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = loginSchema.shape.email.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-xs uppercase tracking-wide text-zinc-500">
                  Email
                </Label>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="enter your email"
                    autoComplete="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={emailLoading || googleLoading}
                    aria-required="true"
                    aria-invalid={field.state.meta.errors.length > 0}
                    aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                    className={
                      field.state.meta.errors.length > 0 ? "border-red-500 bg-white text-zinc-950" : "bg-white text-zinc-950 border-zinc-300"
                    }
                  />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const result = loginSchema.shape.password.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-xs uppercase tracking-wide text-zinc-500">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="enter your password"
                    autoComplete="current-password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={emailLoading || googleLoading}
                    aria-required="true"
                    aria-invalid={field.state.meta.errors.length > 0}
                    aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                    className={
                      field.state.meta.errors.length > 0
                        ? "border-red-500 bg-white text-zinc-950"
                        : "bg-white text-zinc-950 border-zinc-300"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={emailLoading || googleLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-950 transition-colors"
                  >
                    {showPassword ? "Hide password" : "Show password"}
                  </button>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full bg-zinc-950 text-white hover:bg-zinc-800"
                disabled={!canSubmit || emailLoading || googleLoading || isSubmitting}
              >
                {emailLoading || isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="my-6">
          <Separator className="relative bg-zinc-300">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-100 px-2 text-xs text-zinc-500">
              or continue with
            </span>
          </Separator>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-50 hover:text-zinc-950"
          onClick={handleGoogleSignIn}
          disabled={emailLoading || googleLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {googleLoading ? "Signing in..." : "Sign in with Google"}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-600">
            Don&apos;t have an account?{" "}
            {onSwitchToSignUp ? (
              <button
                onClick={onSwitchToSignUp}
                disabled={emailLoading || googleLoading}
                className="text-zinc-950 hover:underline underline-offset-4 font-medium"
              >
                Sign up here
              </button>
            ) : (
              <Link
                href="/signup"
                className="text-zinc-950 hover:underline underline-offset-4 font-medium"
              >
                Sign up here
              </Link>
            )}
          </p>
        </div>
    </div>
  );
}
