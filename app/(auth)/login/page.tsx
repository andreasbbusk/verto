import { SignInForm } from "@/modules/components/auth/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Flashcards",
  description: "Sign in to your Flashcards account",
};

export default function LoginPage() {
  return <SignInForm />;
}
