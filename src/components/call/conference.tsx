"use client";
import { selectPeers, useHMSStore, selectIsConnectedToRoom } from "@100mslive/react-sdk";
import React, { useState, useCallback } from 'react';
import Peer from "../ui/peer";
import { Icons } from "../ui/icons";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";

export default function Conference() {
    const peers = useHMSStore(selectPeers);
    const [loading, setLoading] = React.useState(true);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [transcripts, setTranscripts] = React.useState<string[]>([]);
    const [recordingError, setRecordingError] = React.useState<string | null>(null);
    const [isRecording, setIsRecording] = React.useState(false);
    const { toast } = useToast();

    const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
    const [transcriptPieces, setTranscriptPieces] = useState<string[]>([]);
    const [chunks, setChunks] = useState<Blob[]>([]);

    const transcribeAudio = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('model', 'whisper-1');

        try {
            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                console.error('Transcription failed with status:', response.status);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                return ''; // Return empty string instead of throwing
            }

            const data = await response.json();
            if (data.text) {
                setTranscripts(prev => [...prev, data.text]);
                console.log('Latest transcript:', data.text);
                return data.text;
            }
            return '';
        } catch (error) {
            console.error('Transcription error:', error);
            return ''; // Return empty string instead of throwing
        }
    };

    const generateSummary = useCallback(async (transcriptText: string) => {
        try {
            const response = await fetch('/api/generate-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transcript: transcriptText }),
            });

            if (!response.ok) throw new Error('Failed to generate summary');

            const pdfBlob = await response.blob();
            
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'meeting-summary.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            console.error('Error generating summary:', error);
            toast({
                title: "Error",
                description: "Failed to generate meeting summary",
                variant: "destructive",
            });
        }
    }, [toast]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            
            // Clear previous state
            setChunks([]);
            setTranscriptPieces([]);
            
            // Initialize recording time
            const initialTime = Date.now();
            setRecordingStartTime(initialTime);
            
            recorder.ondataavailable = async (event) => {
                if (event.data.size > 0) {
                    setChunks(prev => [...prev, event.data]);
                }
            };

            recorder.start(5000);
            setMediaRecorder(recorder);
            setIsRecording(true);

        } catch (error) {
            setRecordingError("Failed to start recording");
            console.error("Recording error:", error);
        }
    };

    const stopRecording = async () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            
            const finalAudioBlob = new Blob(chunks, { type: 'audio/webm' });
            if (finalAudioBlob.size > 1000) {
                const finalTranscription = await transcribeAudio(finalAudioBlob);
                const allTranscripts = [...transcriptPieces, finalTranscription]
                    .filter(text => text.trim().length > 0);
                const fullTranscript = allTranscripts.join(' ');
                
                console.log('Transcript pieces:', transcriptPieces);
                console.log('Final transcription:', finalTranscription);
                console.log('Full combined transcript:', fullTranscript);
                
                if (fullTranscript.trim()) {
                    await generateSummary(fullTranscript);
                }
            }
            
            setIsRecording(false);
            setMediaRecorder(null);
            setTranscriptPieces([]);
            setRecordingStartTime(null);
            setChunks([]);
            
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleFullTranscript = (transcript: string) => {
        if (transcript.trim()) {
            console.log('Full transcript:', transcript);
        }
    };

    React.useEffect(() => {
        if (peers.length > 0) {
            setLoading(false);
        }
    }, [peers]);

    return (
        <div className="w-full conference pt-4">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center gap-2">
                <Button
                    onClick={startRecording}
                    disabled={isRecording}
                    variant="secondary"
                    size="sm"
                    className="bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200"
                >
                    {isRecording ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.mic className="mr-2 h-4 w-4" />
                    )}
                    Start Transcribing
                </Button>
                <Button
                    onClick={stopRecording}
                    disabled={!isRecording}
                    variant="secondary"
                    size="sm"
                    className="bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200"
                >
                    <Icons.micOff className="mr-2 h-4 w-4" />
                    Stop Transcribing
                </Button>
            </div>
            {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="flex items-center gap-4">
                        <Icons.spinner color="#fff" width={18} height={18} />
                        <p className="text-lg sm:text-xl">Loading...</p>
                    </div>
                </div>
            ) : (
                <>
                    {recordingError && (
                        <div className="text-red-500 text-center mb-4">
                            {recordingError}
                        </div>
                    )}
                    {peers.map((peer) => <Peer key={peer.id} peer={peer} />)}
                </>
            )}
        </div>
    );
}
