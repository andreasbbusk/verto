import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verto Demo",
  description: "Embedded Verto app demo.",
};

export default function DemoEmbedPage() {
  redirect("/dashboard");
}
