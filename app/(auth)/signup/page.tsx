import { SignUpForm } from "@/modules/components/auth/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Flashcards",
  description: "Create your Flashcards account",
};

export default function SignupPage() {
  return <SignUpForm />;
}
