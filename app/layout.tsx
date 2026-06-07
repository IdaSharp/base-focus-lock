import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Base Focus Lock",
  description: "Record focus intent on Base.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6a24ea8229b4287dd653e303" />
        <meta
          name="talentapp:project_verification"
          content="9de7aff4fed6d0612f022876b2db47a7d0b782aa115a9f29402402f678562167bc6875bfebfe6c24223e54aed6a528f449d0e9ecaf7397fde5e3f9fd72c4f0f3"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
