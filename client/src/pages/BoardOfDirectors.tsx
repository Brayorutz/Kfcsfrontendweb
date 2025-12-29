import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { Users, Linkedin, Mail } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/cinematic_wide_shot_of_a_lush_green_dairy_farm_with_cows_grazing_under_a_bright_sky..png";

const boardMembers = [
  {
    id: 1,
    name: "Samuel Kiplagat",
    title: "Chairman",
    role: "Chairman of the Board",
    experience: "20+ years in dairy farming and cooperative management",
    bio: "Samuel has been instrumental in establishing KFCS as a regional leader in dairy excellence. His visionary leadership has transformed the cooperative into an award-winning organization.",
    board: "executive",
  },
  {
    id: 2,
    name: "Margaret Chepkwony",
    title: "Vice Chairperson",
    role: "Vice Chairperson of the Board",
    experience: "18 years in agricultural development",
    bio: "Margaret brings extensive experience in agricultural policy and farmer advocacy. She has successfully advocated for better prices and market access for cooperative members.",
    board: "executive",
  },
  {
    id: 3,
    name: "David Kipkemboi",
    title: "Treasurer",
    role: "Treasurer of the Board",
    experience: "15+ years in finance and cooperative accounting",
    bio: "David ensures financial transparency and accountability. His expertise in cooperative finance has strengthened KFCS's financial standing.",
    board: "executive",
  },
  {
    id: 4,
    name: "Grace Kiprotich",
    title: "Secretary",
    role: "Secretary of the Board",
    experience: "12 years in cooperative administration",
    bio: "Grace manages all board documentation and member communications. Her attention to detail ensures smooth cooperative operations.",
    board: "executive",
  },
  {
    id: 5,
    name: "Peter Rotich",
    title: "Board Member",
    role: "Director, Production & Quality",
    experience: "16 years in dairy processing and quality control",
    bio: "Peter oversees all production standards and quality assurance. His commitment to excellence has earned KFCS national recognition.",
    board: "executive",
  },
  {
    id: 6,
    name: "Jane Mwangi",
    title: "Board Member",
    role: "Director, Marketing & Sales",
    experience: "14 years in agricultural marketing",
    bio: "Jane leads market expansion initiatives and brand development. She has successfully increased market reach across the region.",
    board: "board",
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
          <p className="text-xl max-w-2xl mx-auto text-primary-foreground/90">
            Meet the dedicated leaders guiding Kabianga Farmers Cooperative Society towards excellence and sustainable growth.
          </p>
        </div>
      </div>

      {/* Leadership Overview */}
      <Section>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-primary mb-6">Our Leadership</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our Board of Directors comprises experienced agricultural professionals, business leaders, and dedicated farmers with deep roots in our communities. Together, they bring diverse expertise, shared values, and unwavering commitment to KFCS's mission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {boardMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
              data-testid={`board-member-${member.id}`}
            >
              {/* Member Image Placeholder */}
              <div className="aspect-[3/4] bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl overflow-hidden mb-6 relative group-hover:shadow-lg transition-all">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-secondary mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium text-primary opacity-40">Photo</p>
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-1" data-testid={`text-name-${member.id}`}>{member.name}</h3>
                <p className="text-sm text-secondary font-medium uppercase tracking-wide mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.experience}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Detailed Board Member Profiles */}
      <Section background="muted">
        <h2 className="text-4xl font-serif font-bold text-center text-primary mb-16">Board Member Profiles</h2>

        <div className="space-y-12">
          {boardMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              data-testid={`profile-${member.id}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                {/* Profile Image */}
                <div className="flex justify-center md:justify-start">
                  <div className="w-48 h-48 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-24 h-24 text-secondary opacity-30" />
                  </div>
                </div>

                {/* Profile Details */}
                <div className="md:col-span-3">
                  <div className="mb-6">
                    <h3 className="text-3xl font-serif font-bold text-primary mb-2">{member.name}</h3>
                    <p className="text-lg font-bold text-secondary uppercase tracking-wide mb-2">{member.title}</p>
                    <p className="text-muted-foreground font-medium">{member.role}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-primary mb-2">Experience</h4>
                    <p className="text-muted-foreground">{member.experience}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-primary mb-2">About</h4>
                    <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                  </div>

                  {/* Contact Icons */}
                  <div className="flex gap-4">
                    <button 
                      className="p-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors text-secondary"
                      data-testid={`btn-email-${member.id}`}
                      aria-label="Email"
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
                      data-testid={`btn-linkedin-${member.id}`}
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Supervisory Board */}
      <Section background="white" className="py-12">
        <h2 className="text-4xl font-serif font-bold text-center text-primary mb-16">Supervisory Board</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {boardMembers.filter((m) => m.board === "supervisory").map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-secondary/5 to-primary/5 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-border/50"
              data-testid={`supervisory-member-${member.id}`}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-secondary opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-1 text-center">{member.name}</h3>
              <p className="text-sm text-secondary font-bold text-center uppercase tracking-wide mb-4">{member.role}</p>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Board Structure */}
      <Section>
        <h2 className="text-4xl font-serif font-bold text-center text-primary mb-16">Board Structure & Committees</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-border/50"
          >
            <h3 className="text-2xl font-serif font-bold text-primary mb-6">Executive Committee</h3>
            <ul className="space-y-3" data-testid="list-executive-committee">
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Chairman - Samuel Kiplagat</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Vice Chairperson - Margaret Chepkwony</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Treasurer - David Kipkemboi</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Secretary - Grace Kiprotich</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-border/50"
          >
            <h3 className="text-2xl font-serif font-bold text-primary mb-6">Board Responsibilities</h3>
            <ul className="space-y-3" data-testid="list-board-responsibilities">
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Provide strategic direction and oversight</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Ensure financial integrity and transparency</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Safeguard member interests</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <span className="text-muted-foreground">Promote sustainable growth and innovation</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
