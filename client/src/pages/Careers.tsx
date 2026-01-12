import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function Careers() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const jobOptions = [
    "Tuktuk Driver",
  ];

  const applyMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Application failed");
      }

      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Application Received!",
        description: "Thank you for your interest. We will contact you when opportunities become available.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    // Submit to our API endpoint
    applyMutation.mutate(formData);
  };

  return (
    <div className="pt-20">
      <div className="bg-primary py-16 md:py-24 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Careers at KFCS</h1>
        <p className="text-lg opacity-90">Join our team and make a difference.</p>
      </div>

      <Section className="max-w-4xl mx-auto">
        {submitted ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">Thank You!</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Your application has been received. We will contact you as soon as relevant opportunities become available.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Submit Another Application
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* No Current Openings Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 mb-1">Here are our job openings.</h3>
                <p className="text-amber-800 text-sm">
                  Please submit your information below and we will notify you as soon as possible.
                </p>
              </div>
            </div>

            {/* Application Form */}
            <Card className="border-t-4 border-t-secondary shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6">Career Interest Form</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="John Doe"
                      data-testid="input-fullname"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        data-testid="input-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="0700 000 000"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobPosition">Interested Position *</Label>
                    <select
                      id="jobPosition"
                      name="jobPosition"
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                      data-testid="select-job-position"
                    >
                      <option value="">-- Select a position --</option>
                      {jobOptions.map((job) => (
                        <option key={job} value={job}>
                          {job}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Upload Resume/CV *</Label>
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
                      data-testid="input-resume"
                    />
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: PDF, DOC, DOCX, TXT (Max 5MB)
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg"
                      disabled={applyMutation.isPending}
                      data-testid="button-submit-career"
                    >
                      {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      We will review your application and contact you when suitable positions become available.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </Section>
    </div>
  );
}
