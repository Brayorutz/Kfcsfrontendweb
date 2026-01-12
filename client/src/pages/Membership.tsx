import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Membership() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Extract form data
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      nationalId: formData.get("idNumber") as string,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || undefined,
      village: formData.get("village") as string,
    };

    setIsSubmitting(true);

    try {
      // First, send to backend API
      const response = await fetch("/api/members/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Application failed");
      }

      // After successful backend submission, send email notification
      const emailData = {
        firstName: data.firstName,
        lastName: data.lastName,
        nationalId: data.nationalId,
        phone: data.phone,
        email: data.email || "No email provided",
        village: data.village,
        to: "kabiangafarmerssacco@gmail.com",
        subject: "New Membership Application",
      };

      // Send email notification (non-blocking, just log errors)
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      }).catch(err => console.error("Email send error:", err));

      setSubmitted(true);
      toast({
        title: "Application Received!",
        description: "We have received your membership application. We will contact you shortly.",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "There was a problem submitting your application.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
       <div className="bg-primary py-16 md:py-24 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Become a Member</h1>
        <p className="text-lg opacity-90">Join 5,000+ farmers in the success story.</p>
      </div>

      <Section className="max-w-4xl mx-auto">
        {submitted ? (
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-4">Thank You!</h2>
                <p className="text-muted-foreground text-lg mb-8">Your application has been successfully submitted. Our team will review your details and get back to you within 48 hours.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Submit Another Application</Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-primary mb-6">Why Join KFCS?</h3>
                    <ul className="space-y-4 mb-8">
                        {[
                            "Guaranteed market for your milk",
                            "Access to affordable high-quality feeds",
                            "Advance payments and financial support",
                            "Regular training and extension services",
                            "Annual dividends and bonuses"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5" />
                                <span className="text-foreground/80">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="bg-muted p-6 rounded-2xl border border-border">
                        <h4 className="font-bold text-primary mb-2">Get Farmer App</h4>
                        <p className="text-sm text-muted-foreground mb-4">Manage your deliveries and payments on the go with our mobile app.</p>
                        <Link href="https://play.google.com/store/apps/details?id=com.getfarmer.app" target="_blank">
                            <Button className="w-full bg-black hover:bg-black/90 text-white gap-2">
                                <img src="https://img.icons8.com/color/48/google-play.png" className="w-5 h-5" alt="Play Store" />
                                Download on Play Store
                            </Button>
                        </Link>
                    </div>
                </div>
                <Card className="md:col-span-3 border-t-4 border-t-secondary shadow-lg">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold mb-6">Membership Application Form</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" required placeholder="John" data-testid="input-firstname" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" required placeholder="Doe" data-testid="input-lastname" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="idNumber">National ID Number</Label>
                                <Input id="idNumber" name="idNumber" required placeholder="12345678" data-testid="input-nationalid" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" type="tel" required placeholder="0700 000 000" data-testid="input-phone" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" placeholder="john@example.com" data-testid="input-email" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="village">Village / Area</Label>
                                <Input id="village" name="village" required placeholder="Kabianga Centre" data-testid="input-village" />
                            </div>
                            <div className="pt-4">
                                <Button 
                                  type="submit" 
                                  className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg"
                                  data-testid="button-submit-application"
                                  disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Application"}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    By submitting this form, you agree to our terms and conditions. Membership is free.
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

