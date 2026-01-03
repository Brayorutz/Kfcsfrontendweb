import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/Section";
import { Users, Linkedin, Mail, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import heroImage from "@assets/generated_images/cinematic_wide_shot_of_a_lush_green_dairy_farm_with_cows_grazing_under_a_bright_sky..png";

import mikeKorosImage from "@assets/Mike_Koros,_Chairman_1767428441588.png";
import mosesRotichImage from "@assets/Moses_Rotich,_Vice_Chairperson_1767428441588.png";
import janetChepkemoiImage from "@assets/Janet_Chepkemoi,_Hon._Secretary_1767428441586.png";
import raphaelSangImage from "@assets/Raphael_Sang,_Treasurer_1767428441589.png";
import davidTooImage from "@assets/David_Too,_Director,_Procurement_1767428441584.png";
import isaiahKorirImage from "@assets/Isaiah_Korir,_Director,_Transport_and_Logistics_1767428441585.png";
import davidRuttoImage from "@assets/Dvid_Ruttoh,_Director,_Welfare_and_Conflict_Resolution_1767428441585.png";
import johnCheruiyotImage from "@assets/John_Cheruiyot,_Director,_Board_of_Management_1767428441586.png";
import lilianRonoImage from "@assets/Lilian_Rono,_Director,_Board_of_Management_1767428441587.png";
import kiplangatKiruiImage from "@assets/Kiplangat_Richard_Kirui,_Director,_Supervisory_1767428441587.png";
import betsyKosgeiImage from "@assets/Betsy_Kosgei,_Director,_Supervisory_1767428441583.png";

interface BoardMember {
  id: number;
  name: string;
  title: string;
  role: string;
  experience: string;
  bio: string;
  image: string;
  board: "management" | "supervisory";
}

const boardMembers: BoardMember[] = [
  {
    id: 1,
    name: "Mike Koros",
    title: "Chairman",
    role: "Board Chairman",
    experience: "Extensive leadership in cooperative management and agricultural advocacy.",
    bio: "Mike Koros leads the board with a vision for sustainable growth and member empowerment, ensuring KFCS remains a leader in the dairy sector.",
    image: mikeKorosImage,
    board: "management",
  },
  {
    id: 2,
    name: "Moses Rotich",
    title: "Vice Chairperson",
    role: "Board Vice Chairperson",
    experience: "Years of experience in strategic planning and farmer relations.",
    bio: "Moses supports the chairperson in overseeing board operations and fostering strong relationships with members and stakeholders.",
    image: mosesRotichImage,
    board: "management",
  },
  {
    id: 3,
    name: "Janet Chepkemoi",
    title: "Hon. Secretary",
    role: "Board Secretary",
    experience: "Expertise in administrative governance and member records management.",
    bio: "Janet ensures all board communications and records are meticulously maintained, facilitating smooth organizational flow.",
    image: janetChepkemoiImage,
    board: "management",
  },
  {
    id: 4,
    name: "Raphael Sang",
    title: "Treasurer",
    role: "Board Treasurer",
    experience: "Strong background in financial management and cooperative accounting.",
    bio: "Raphael oversees the cooperative's financial health, ensuring transparency and efficient resource allocation.",
    image: raphaelSangImage,
    board: "management",
  },
  {
    id: 5,
    name: "David Too",
    title: "Director",
    role: "Director, Procurement",
    experience: "Specialized in supply chain management and agricultural sourcing.",
    bio: "David ensures the efficient procurement of resources necessary for the cooperative's dairy production and processing activities.",
    image: davidTooImage,
    board: "management",
  },
  {
    id: 6,
    name: "Isaiah Korir",
    title: "Director",
    role: "Director, Transport and Logistics",
    experience: "Experienced in logistics optimization and fleet management.",
    bio: "Isaiah manages the transportation network, ensuring timely and safe delivery of milk and products from farm to processing.",
    image: isaiahKorirImage,
    board: "management",
  },
  {
    id: 7,
    name: "David Rutto",
    title: "Director",
    role: "Director, Welfare and Conflict Resolution",
    experience: "Skilled in community mediation and member welfare programs.",
    bio: "David focuses on the well-being of cooperative members and resolves disputes to maintain harmony within the society.",
    image: davidRuttoImage,
    board: "management",
  },
  {
    id: 8,
    name: "John Cheruiyot",
    title: "Director",
    role: "Director, Board of Management",
    experience: "Dedicated to general cooperative governance and production standards.",
    bio: "John contributes to the broad strategic goals of the board, focusing on enhancing production efficiency and member participation.",
    image: johnCheruiyotImage,
    board: "management",
  },
  {
    id: 9,
    name: "Lilian Rono",
    title: "Director",
    role: "Director, Board of Management",
    experience: "Focused on gender inclusivity and community-driven agricultural growth.",
    bio: "Lilian works to ensure all segments of our farming community are represented and supported in the cooperative's growth plans.",
    image: lilianRonoImage,
    board: "management",
  },
  {
    id: 10,
    name: "Kiplangat Richard Kirui",
    title: "Director",
    role: "Director, Supervisory Board",
    experience: "Extensive audit and oversight experience in cooperative systems.",
    bio: "Kiplangat provides critical oversight to ensure the cooperative's management follows all regulatory and internal protocols.",
    image: kiplangatKiruiImage,
    board: "supervisory",
  },
  {
    id: 11,
    name: "Betsy Kosgei",
    title: "Director",
    role: "Director, Supervisory Board",
    experience: "Expert in accountability and transparent governance practices.",
    bio: "Betsy ensures that member interests are protected through rigorous auditing and supervision of all cooperative financial and operational decisions.",
    image: betsyKosgeiImage,
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
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
                <div className="bg-muted aspect-square md:aspect-auto flex items-center justify-center relative overflow-hidden">
                  <img src={selectedMember.image} alt={selectedMember.name} className="absolute inset-0 w-full h-full object-cover" />
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
