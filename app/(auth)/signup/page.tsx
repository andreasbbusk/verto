import { SignUpForm } from "@/modules/components/auth/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Verto",
  description: "Create your Verto account",
};

export default function SignupPage() {
  return <SignUpForm />;
}
