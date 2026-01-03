import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/Section";
import { Users, Linkedin, Mail, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import heroImage from "@assets/generated_images/cinematic_wide_shot_of_a_lush_green_dairy_farm_with_cows_grazing_under_a_bright_sky..png";

interface BoardMember {
  id: number;
  name: string;
  title: string;
  role: string;
  experience: string;
  bio: string;
  board: "management" | "supervisory";
}

const boardMembers: BoardMember[] = [
  {
    id: 1,
    name: "Samuel Kiplagat",
    title: "Chairman",
    role: "Chairman of the Board",
    experience: "20+ years in dairy farming and cooperative management",
    bio: "Samuel has been instrumental in establishing KFCS as a regional leader in dairy excellence. His visionary leadership has transformed the cooperative into an award-winning organization.",
    board: "management",
  },
  {
    id: 2,
    name: "Margaret Chepkwony",
    title: "Vice Chairperson",
    role: "Vice Chairperson of the Board",
    experience: "18 years in agricultural development",
    bio: "Margaret brings extensive experience in agricultural policy and farmer advocacy. She has successfully advocated for better prices and market access for cooperative members.",
    board: "management",
  },
  {
    id: 3,
    name: "David Kipkemboi",
    title: "Treasurer",
    role: "Treasurer of the Board",
    experience: "15+ years in finance and cooperative accounting",
    bio: "David ensures financial transparency and accountability. His expertise in cooperative finance has strengthened KFCS's financial standing.",
    board: "management",
  },
  {
    id: 4,
    name: "Grace Kiprotich",
    title: "Secretary",
    role: "Secretary of the Board",
    experience: "12 years in cooperative administration",
    bio: "Grace manages all board documentation and member communications. Her attention to detail ensures smooth cooperative operations.",
    board: "management",
  },
  {
    id: 5,
    name: "Peter Rotich",
    title: "Board Member",
    role: "Director, Production & Quality",
    experience: "16 years in dairy processing and quality control",
    bio: "Peter oversees all production standards and quality assurance. His commitment to excellence has earned KFCS national recognition.",
    board: "management",
  },
  {
    id: 6,
    name: "Jane Mwangi",
    title: "Board Member",
    role: "Director, Marketing & Sales",
    experience: "14 years in agricultural marketing",
    bio: "Jane leads market expansion initiatives and brand development. She has successfully increased market reach across the region.",
    board: "management",
  },
  {
    id: 7,
    name: "Joseph Kipchoge",
    title: "Supervisory Board",
    role: "Supervisor, Member Relations",
    experience: "13 years in farmer engagement and training",
    bio: "Joseph coordinates member oversight and ensures cooperative compliance with regulations. He is dedicated to member protection and good governance.",
    board: "supervisory",
  },
  {
    id: 8,
    name: "Susan Cherotich",
    title: "Supervisory Board",
    role: "Supervisor, Sustainability & CSR",
    experience: "11 years in sustainable farming and community development",
    bio: "Susan leads KFCS's sustainability oversight and community initiatives. Her focus on environmental responsibility guides cooperative practices.",
    board: "supervisory",
  },
  {
    id: 9,
    name: "Robert Kamau",
    title: "Supervisory Board",
    role: "Supervisor, Finance & Audit",
    experience: "17 years in cooperative auditing and financial compliance",
    bio: "Robert ensures strict financial oversight and regulatory compliance. His expertise protects member interests and maintains organizational integrity.",
    board: "supervisory",
  },
];

export default function BoardOfDirectors() {
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);

  const managementBoard = boardMembers.filter(m => m.board === "management");
  const supervisoryBoard = boardMembers.filter(m => m.board === "supervisory");

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-primary py-20 md:py-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={heroImage} className="w-full h-full object-cover grayscale" alt="Background" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="mb-4">
            <Link href="/about" className="text-primary-foreground/80 hover:text-white transition-colors text-sm font-medium">
              ← Back to About Us
            </Link>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Board of Directors</h1>
          <p className="text-xl max-w-2xl mx-auto text-primary-foreground/90 font-light">
            Meet the dedicated leaders guiding Kabianga Farmers Cooperative Society towards excellence and sustainable growth.
          </p>
        </div>
      </div>

      {/* Board of Management */}
      <Section id="management-board">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">Governance</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Board of Management</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Responsible for the overall strategic direction, policy formulation, and operational oversight of the cooperative.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {managementBoard.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => setSelectedMember(member)}
              data-testid={`management-member-${member.id}`}
            >
              <div className="aspect-[4/5] bg-muted rounded-2xl overflow-hidden mb-6 relative shadow-md group-hover:shadow-xl transition-all duration-300 ring-1 ring-border/50">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white text-sm font-medium">View Full Profile</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/10 to-primary/10">
                  <Users className="w-20 h-20 text-primary/20" />
                </div>
              </div>

              <div className="text-center px-4">
                <h3 className="text-2xl font-serif font-bold text-primary mb-1 group-hover:text-secondary transition-colors">{member.name}</h3>
                <p className="text-sm text-secondary font-bold uppercase tracking-widest mb-3">{member.title}</p>
                <p className="text-muted-foreground text-sm line-clamp-2">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Board of Supervisory */}
      <Section id="supervisory-board" background="muted">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">Oversight</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Board of Supervisory</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Providing independent oversight and ensuring transparency, accountability, and compliance across all cooperative activities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {supervisoryBoard.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => setSelectedMember(member)}
              data-testid={`supervisory-member-${member.id}`}
            >
              <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden mb-6 relative shadow-md group-hover:shadow-xl transition-all duration-300 ring-1 ring-border/50">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white text-sm font-medium">View Full Profile</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/10 to-primary/10">
                  <Users className="w-20 h-20 text-primary/20" />
                </div>
              </div>

              <div className="text-center px-4">
                <h3 className="text-2xl font-serif font-bold text-primary mb-1 group-hover:text-secondary transition-colors">{member.name}</h3>
                <p className="text-sm text-secondary font-bold uppercase tracking-widest mb-3">Supervisor</p>
                <p className="text-muted-foreground text-sm line-clamp-2">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Profile Popup/Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
              data-testid="member-profile-modal"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-muted hover:bg-muted-foreground/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-primary" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Section */}
                <div className="bg-muted aspect-square md:aspect-auto flex items-center justify-center relative">
                  <Users className="w-32 h-32 text-primary/10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5" />
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12">
                  <div className="mb-8">
                    <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">
                      {selectedMember.board === "management" ? "Board of Management" : "Board of Supervisory"}
                    </span>
                    <h2 className="text-4xl font-serif font-bold text-primary mb-2">{selectedMember.name}</h2>
                    <p className="text-xl font-bold text-secondary mb-1 uppercase tracking-wider">{selectedMember.title}</p>
                    <p className="text-muted-foreground font-medium italic">{selectedMember.role}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-primary text-lg mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        Professional Experience
                      </h4>
                      <p className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-muted">
                        {selectedMember.experience}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-primary text-lg mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        About
                      </h4>
                      <p className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-muted">
                        {selectedMember.bio}
                      </p>
                    </div>

                    <div className="pt-6 flex gap-4">
                      <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-all font-medium">
                        <Mail className="w-4 h-4" /> Contact
                      </button>
                      <button className="flex items-center gap-2 border border-border px-6 py-3 rounded-full hover:bg-muted transition-all font-medium">
                        <Linkedin className="w-4 h-4 text-[#0077b5]" /> LinkedIn
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
