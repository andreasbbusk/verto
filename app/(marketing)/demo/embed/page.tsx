import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DEMO_EMBED_START_PATH } from "@/modules/server/demo/constants";

export const metadata: Metadata = {
  title: "Verto Demo",
  description: "Embedded Verto app demo.",
};

export default function DemoEmbedPage() {
  redirect(DEMO_EMBED_START_PATH);
}
