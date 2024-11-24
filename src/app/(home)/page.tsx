import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export default function IndexPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto max-w-[1400px] py-16 lg:py-20">
        <div className="flex flex-col items-center gap-16">
          {/* Main Hero Content */}
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-4 py-1">
                Patient Trusted
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-1">
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-4 py-1">
                PHIPA Compliant
              </Badge>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                <span className="block text-emerald-600">PharmScribe.ai</span>
                <span className="mt-2 block text-4xl sm:text-5xl md:text-5xl">Transform Patient Care</span>
                <span className="block text-4xl sm:text-5xl md:text-5xl">With AI-Enhanced Consultations</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                Revolutionizing pharmacist-patient interactions with real-time AI transcription, 
                smart summaries, and automated medication reminders.
              </p>
            </div>

            <div className="flex gap-4 mt-4">
              <Link href="/register">
                <Button size="lg" className="py-6 px-8 text-lg bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="py-6 px-8 text-lg">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Platform Preview */}
          <div className="relative w-full max-w-5xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg blur opacity-30"></div>
            <div className="relative">
              <Image
                src="/hero-image.png"
                width={1200}
                height={800}
                alt="PharmScribe.ai Platform Preview"
                className="rounded-lg shadow-2xl border border-gray-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">Comprehensive tools for modern pharmaceutical care</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">AI Transcription</h3>
              <p className="text-muted-foreground">Real-time conversation transcription with medical terminology recognition.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Smart Summaries</h3>
              <p className="text-muted-foreground">AI-generated consultation summaries with key points and action items.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Medication Tracking</h3>
              <p className="text-muted-foreground">Automated reminders and adherence monitoring system.</p>
            </div>
            {/* Add more feature cards as needed */}
          </div>
        </div>
      </section>

      {/* How It Works section (keep existing) */}
      
      {/* Add CTA Section */}
      <section className="bg-emerald-50 py-20">
        <div className="container mx-auto max-w-[1400px] text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Practice?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join healthcare professionals who are revolutionizing patient care with PharmScribe.ai
          </p>
          <Link href="/register">
            <Button size="lg" className="py-6 px-8 text-lg bg-emerald-600 hover:bg-emerald-700">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
