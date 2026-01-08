import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const locations = [
  {
    name: "Kabianga Centre (HQ & Processing)",
    address: "Kericho County, Kenya",
    poBox: "PO Box 123 - 20200, Kericho",
    phone: "0743719091",
    email: "kabiangafarmerssacco@gmail.com",
    hours: "Mon - Fri: 8:00 AM - 5:00 PM, Sat: 8:00 AM - 1:00 PM",
  },
  {
    name: "Taplotin selling point",
    address: "Kericho County, Kenya",
    poBox: "PO Box 456 - 20200",
    phone: "0743719091",
    email: "kabiangafarmerssacco@gmail.com",
    hours: "Mon - Fri: 6:00 AM - 6:00 PM, Sat - Sun: 8:00 AM - 4:00 PM",
  
  },
  {
    name: "Nairobi Distribution Centre",
    address: "Industrial Area, Nairobi",
    poBox: "PO Box 789 - 00100, Nairobi",
    phone: "0743719091",
    email: "kabiangafarmerssacco@gmail.com",
    hours: "Mon - Fri: 7:00 AM - 5:00 PM, Sat: 8:00 AM - 2:00 PM",
  },
];

export default function Contact() {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Using Formspree to send to kabiangafarmerssacco@gmail.com
    fetch("https://formspree.io/f/mqaejebz", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        form.reset();
        toast({
          title: "Message Sent",
          description: "Thank you for your message. We'll get back to you soon at kabiangafarmerssacco@gmail.com!",
        });
      } else {
        throw new Error("Submission failed");
      }
    }).catch(error => {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    });
  };
  return (
    <div className="pt-20">
       <div className="bg-primary py-16 md:py-24 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Contact Us</h1>
        <p className="text-lg opacity-90">We'd love to hear from you.</p>
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-8">Get in Touch</h2>
                <form 
                    className="space-y-6"
                    onSubmit={handleSubmit}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input name="name" required placeholder="Your Name" data-testid="input-contact-name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input name="email" type="email" required placeholder="Your Email" data-testid="input-contact-email" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input name="subject" required placeholder="Inquiry Subject" data-testid="input-contact-subject" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea name="message" required placeholder="How can we help you?" className="min-h-[150px]" data-testid="textarea-contact-message" />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-white h-12" data-testid="button-contact-send">Send Message</Button>
                </form>
            </div>

            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-primary mb-8">Head Office</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Kabianga Centre</h3>
                                <p className="text-muted-foreground">Kericho County, Kenya<br />PO Box 123 - 20200, Kericho</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Phone</h3>
                                <p className="text-muted-foreground">0743719091</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Email</h3>
                                <p className="text-muted-foreground">kabiangafarmerssacco@gmail.com</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Opening Hours</h3>
                                <p className="text-muted-foreground">Mon - Fri: 8:00 AM - 5:00 PM<br />Sat: 8:00 AM - 1:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Locations with Maps */}
        <div>
          <h2 className="text-4xl font-serif font-bold text-primary mb-2">Our Locations</h2>
          <p className="text-muted-foreground mb-12 text-lg">Visit us at any of our centers</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {locations.map((location, index) => (
              <div key={index} className="space-y-6" data-testid={`card-location-${index}`}>
                {/* Map */}
                <div className="rounded-xl overflow-hidden shadow-lg h-64">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                   
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Location Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-primary" data-testid={`text-location-name-${index}`}>{location.name}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-sm">{location.address}</p>
                        <p className="text-muted-foreground text-sm">{location.poBox}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-secondary transition-colors text-sm">
                        {location.phone}
                      </a>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <a href={`mailto:${location.email}`} className="text-muted-foreground hover:text-secondary transition-colors text-sm">
                        {location.email}
                      </a>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <p className="text-muted-foreground text-sm">{location.hours}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
