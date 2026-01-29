import { SignInForm } from "@/modules/components/auth/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Verto",
  description: "Sign in to your Verto account",
};

export default function LoginPage() {
  return <SignInForm />;
}
