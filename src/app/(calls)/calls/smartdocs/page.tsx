import { type Metadata } from "next";
import { formatDate } from "~/lib/date";
import { Icons } from "~/components/ui/icons";

export const metadata: Metadata = {
  title: "SmartDocs - PharmScribe",
  description: "View your meeting transcripts and documents",
};

interface SmartDoc {
  id: string;
  title: string;
  date: Date;
  pdfUrl: string;
}

// This is mock data - replace with your actual data fetching logic
const mockData: SmartDoc[] = [
  {
    id: "1",
    title: "Monthly Check In - Ankit Batra",
    date: new Date("2024-11-24"),
    pdfUrl: "/docs/consultation-1.pdf",
  },
];

export default async function SmartDocsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">SmartDocs</h1>
        <div className="text-sm text-muted-foreground">
          {mockData.length} documents
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b bg-muted/50">
              <tr className="text-left">
                <th className="p-4 font-medium">Meeting Title</th>
                <th className="p-4 font-medium">Meeting Date</th>
                <th className="p-4 font-medium">Document</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4">{doc.title}</td>
                  <td className="p-4">{formatDate(doc.date)}</td>
                  <td className="p-4">
                    <a
                      href={doc.pdfUrl}
                      className="inline-flex items-center text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icons.download className="mr-2 h-4 w-4" />
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}