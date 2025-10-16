
import "../styles/globals.css";
import { ReactNode } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  metadataBase: new URL("https://summa.vision"),
  title: { default: "summa.vision", template: "%s — summa.vision" },
  description: "summa.vision — static charts & sections (MVP)",
  openGraph: {
    title: "summa.vision",
    description: "Static charts & sections",
    images: ["/logo.png"]
  },
  icons: {
    icon: "/favicon.png"
  }
};

function ThemeScript() {
  const code = `
  (function(){
    try{
      var k='theme';
      var t=localStorage.getItem(k)||'dark';
      document.documentElement.setAttribute('data-theme', t);
    }catch(e){}
  })();`;
  return <script dangerouslySetInnerHTML={{__html: code}} />;
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body>
        <SiteHeader />
        <main className="container py-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
