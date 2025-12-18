import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="pt-20">
       <div className="bg-primary py-16 md:py-24 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Contact Us</h1>
        <p className="text-lg opacity-90">We'd love to hear from you.</p>
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-8">Get in Touch</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input placeholder="Your Name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" placeholder="Your Email" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input placeholder="Inquiry Subject" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea placeholder="How can we help you?" className="min-h-[150px]" />
                    </div>
                    <Button className="w-full bg-primary text-white h-12">Send Message</Button>
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
                                <p className="text-muted-foreground">+254 700 000 000<br />+254 722 000 000</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Email</h3>
                                <p className="text-muted-foreground">info@kabiangafcs.co.ke<br />sales@kabiangafcs.co.ke</p>
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

                <div className="bg-muted p-6 rounded-xl">
                    <h3 className="font-bold mb-4">Our Locations</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Kabianga Centre (HQ & Processing)</li>
                        <li>• Taplotin Cooling Plant</li>
                        <li>• Nairobi Distribution Centre (Industrial Area)</li>
                        <li>• Kericho Town Branch</li>
                    </ul>
                </div>
            </div>
        </div>
      </Section>
    </div>
  );
}
