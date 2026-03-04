import type { Metadata } from "next";
import { EmbedAppDemo } from "@/modules/components/demo/embed-app-demo";

export const metadata: Metadata = {
  title: "Verto Demo",
  description: "Interactive Verto app demo for embedded portfolio previews.",
};

export default function DemoEmbedPage() {
  return <EmbedAppDemo />;
}
