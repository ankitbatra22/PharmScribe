import { NextResponse } from "next/server";
import { env } from "~/env.mjs";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get('file') as Blob;

        if (!audioFile) {
            return NextResponse.json(
                { error: "No audio file provided" },
                { status: 400 }
            );
        }

        const audioBlob = new Blob([audioFile], { type: 'audio/webm' });
        
        const whisperFormData = new FormData();
        whisperFormData.append('file', audioBlob, 'audio.webm');
        whisperFormData.append('model', 'whisper-1');
        whisperFormData.append('language', 'en');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
            },
            body: whisperFormData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Whisper API error:', errorText);
            throw new Error('Whisper API error');
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
            { error: "Failed to transcribe audio" },
            { status: 500 }
        );
    }
}