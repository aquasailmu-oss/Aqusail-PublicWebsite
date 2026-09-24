import { SmoothScroll } from "@/components/motion";
import { EnquiryProvider } from "@/components/site/Enquiry";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppFloat } from "@/components/site/ui";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnquiryProvider>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <SmoothScroll />
      <Header />
      <main id="main" className="site-main">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </EnquiryProvider>
  );
}
