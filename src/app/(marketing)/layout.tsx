import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNavbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
