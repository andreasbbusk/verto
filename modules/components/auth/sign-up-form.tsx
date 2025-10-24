"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  registerSchema,
  type RegisterFormData,
} from "@/modules/schemas/authSchemas";
import { Button } from "@/modules/components/ui/button";
import { Input } from "@/modules/components/ui/input";
import { Label } from "@/modules/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/components/ui/card";
import { Alert, AlertDescription } from "@/modules/components/ui/alert";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface SignUpFormProps {
  onSwitchToSignIn?: () => void;
}

interface PasswordCheck {
  label: string;
  test: boolean;
}

export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    } as RegisterFormData,
    onSubmit: async ({ value }) => {
      setError("");
      const validation = registerSchema.safeParse(value);
      if (!validation.success) {
        setError(validation.error.issues[0].message);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Registration failed");
          setLoading(false);
          return;
        }

        await signIn("credentials", {
          email: value.email,
          password: value.password,
          callbackUrl: "/dashboard",
        });
      } catch (err) {
        setError("Registration failed");
        setLoading(false);
      }
    },
  });

  // Password strength indicator
  const getPasswordStrength = (password: string): PasswordCheck[] => {
    return [
      { label: "At least 6 characters", test: password.length >= 6 },
      { label: "Contains lowercase letter", test: /[a-z]/.test(password) },
      { label: "Contains uppercase letter", test: /[A-Z]/.test(password) },
      { label: "Contains number", test: /\d/.test(password) },
    ];
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription>
          Create your account to start learning with flashcards
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.name.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Full Name</Label>
                <Input
                  id={field.name}
                  type="text"
                  placeholder="enter your full name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={loading}
                  className={
                    field.state.meta.errors.length > 0 ? "border-red-500" : ""
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
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.email.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  type="email"
                  placeholder="enter your email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={loading}
                  className={
                    field.state.meta.errors.length > 0 ? "border-red-500" : ""
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
                const result = registerSchema.shape.password.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <div className="relative">
                  <Input
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="create a strong password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={loading}
                    className={
                      field.state.meta.errors.length > 0
                        ? "border-red-500 pr-10"
                        : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Password strength indicator */}
                {field.state.value && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Password requirements:
                    </p>
                    {getPasswordStrength(field.state.value).map(
                      (check, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          {check.test ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span
                            className={`text-xs ${
                              check.test ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {check.label}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}

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
                className="w-full"
                disabled={!canSubmit || loading || isSubmitting}
              >
                {loading || isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={onSwitchToSignIn}
              disabled={loading}
            >
              Sign in here
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
