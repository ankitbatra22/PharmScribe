import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "SmartDocs - PharmScribe",
  description: "View your meeting transcripts and documents",
};

interface SmartDocsLayoutProps {
  children: React.ReactNode;
}

export default function SmartDocsLayout({ children }: SmartDocsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </main>
    </div>
  );
} 