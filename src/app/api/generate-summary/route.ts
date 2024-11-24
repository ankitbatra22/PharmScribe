import { NextResponse } from 'next/server';
import jsPDF from 'jspdf';

export async function POST(req: Request) {
    try {
        const { transcript } = await req.json();
        
        if (!transcript || transcript.trim() === '') {
            throw new Error('No transcript provided');
        }

        // Enhanced prompt for better structured summary
        const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: `Analyze the conversation and provide a structured summary with the following sections:
                    1. Overall Summary (overview of the patient/practitioner conversation)
                    2. Key Discussion Points (bullet points of main topics)
                    3. Action Items (specific tasks or follow-ups)
                    
                    Format each section with clear headings and bullet points where appropriate.`
                }, {
                    role: "user",
                    content: transcript
                }]
            })
        });

        const summaryData = await summaryResponse.json();
        const summary = summaryData.choices[0].message.content;

        // Enhanced PDF Generation
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        
        // Title
        doc.setFontSize(24);
        doc.setTextColor(44, 62, 80);
        doc.text('Meeting Summary', pageWidth / 2, 20, { align: 'center' });
        
        // Date
        doc.setFontSize(10);
        doc.setTextColor(127, 140, 141);
        const date = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.text(date, pageWidth / 2, 30, { align: 'center' });
        
        // Divider
        doc.setDrawColor(189, 195, 199);
        doc.line(20, 35, pageWidth - 20, 35);
        
        // Summary Content
        doc.setFontSize(12);
        doc.setTextColor(52, 73, 94);
        const splitSummary = doc.splitTextToSize(summary, pageWidth - 40);
        doc.text(splitSummary, 20, 45);
        
        // Full Transcript Section
        const summaryHeight = doc.getTextDimensions(splitSummary).h;
        const transcriptY = summaryHeight + 65;
        
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 80);
        doc.text('Full Transcript', 20, transcriptY);
        
        // Transcript content
        doc.setFontSize(10);
        doc.setTextColor(74, 85, 104);
        const splitTranscript = doc.splitTextToSize(transcript, pageWidth - 40);
        doc.text(splitTranscript, 20, transcriptY + 10);

        const pdfBuffer = doc.output('arraybuffer');

        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=meeting-summary.pdf'
            }
        });
    } catch (error) {
        console.error('PDF generation error:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
} 