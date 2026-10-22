"use client";

import * as React from "react";
import {
  GraduationCap,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Download,
  Share2,
  Eye,
  EyeOff,
  Award,
  Code2,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  Globe,
  Briefcase,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useLocalStorage, STORAGE_KEYS, defaultPortfolioProfile } from "@/lib/storage";
import type {
  PortfolioProfile,
  ProjectItem,
  CertificationItem,
  SkillItem,
} from "@/lib/types";

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    type: "project",
    title: "CampusEats: Crowdsourced Dining Hall Tracker",
    term: "Spring 2024",
    description: "Real-time menu ratings and crowd density tracker for campus dining halls using Next.js and Tailwind. Enables students to submit dish feedback.",
    technologies: ["React", "TypeScript", "Tailwind", "Supabase"],
    link: "https://campuseats.live",
    githubUrl: "https://github.com/alexrivera/campuseats",
  },
  {
    id: "proj-2",
    type: "project",
    title: "EcoRoute: Carbon-Neutral Commute Planner",
    term: "Fall 2024",
    description: "Transit routing optimization tool calculating lowest carbon emission routes across bike, electric shuttle, and walking paths for university campuses.",
    technologies: ["Python", "FastTree", "Leaflet.js", "OpenStreetMap"],
    link: "https://ecoroute.app",
    githubUrl: "https://github.com/alexrivera/ecoroute",
  },
  {
    id: "proj-3",
    type: "project",
    title: "StudyBuddy AI: Semantic Lecture Search",
    term: "Winter 2024",
    description: "Vector-search powered search engine for lecture transcripts with auto-generated flashcards and key concept quizzes built for students.",
    technologies: ["Python", "LangChain", "Pinecone", "FastAPI"],
    link: "https://studybuddy-demo.ai",
    githubUrl: "https://github.com/alexrivera/studybuddy",
  },
];

const INITIAL_CERTIFICATIONS: CertificationItem[] = [
  {
    id: "cert-1",
    type: "certification",
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    issueDate: "Aug 2024",
    credentialId: "AWS-8921-X9K",
    credentialUrl: "https://aws.amazon.com/verification",
  },
  {
    id: "cert-2",
    type: "certification",
    name: "Meta Front-End Developer Professional Certificate",
    issuer: "Coursera & Meta",
    issueDate: "June 2024",
    credentialId: "META-FE-7724",
    credentialUrl: "https://coursera.org/verify/meta",
  },
  {
    id: "cert-3",
    type: "certification",
    name: "Prompt Engineering & LLM Apps Specialization",
    issuer: "DeepLearning.AI",
    issueDate: "March 2024",
    credentialId: "DLAI-LLM-401",
    credentialUrl: "https://deeplearning.ai/verify",
  },
];

const INITIAL_SKILLS: SkillItem[] = [
  { id: "sk-1", type: "skill", name: "Python", category: "Languages", proficiency: "advanced" },
  { id: "sk-2", type: "skill", name: "TypeScript", category: "Languages", proficiency: "advanced" },
  { id: "sk-3", type: "skill", name: "JavaScript", category: "Languages", proficiency: "advanced" },
  { id: "sk-4", type: "skill", name: "C++", category: "Languages", proficiency: "intermediate" },
  { id: "sk-5", type: "skill", name: "SQL", category: "Languages", proficiency: "proficient" },
  { id: "sk-6", type: "skill", name: "React / Next.js", category: "Frameworks", proficiency: "advanced" },
  { id: "sk-7", type: "skill", name: "Tailwind CSS", category: "Frameworks", proficiency: "advanced" },
  { id: "sk-8", type: "skill", name: "Node.js", category: "Developer Tools", proficiency: "proficient" },
  { id: "sk-9", type: "skill", name: "Git / GitHub", category: "Developer Tools", proficiency: "advanced" },
  { id: "sk-10", type: "skill", name: "Docker", category: "Developer Tools", proficiency: "intermediate" },
  { id: "sk-11", type: "skill", name: "Figma", category: "Design", proficiency: "proficient" },
];

export default function PortfolioPage() {
  const { toast } = useToast();
  const [profile, setProfile] = useLocalStorage<PortfolioProfile>(
    STORAGE_KEYS.PORTFOLIO,
    defaultPortfolioProfile
  );

  const [projects, setProjects] = useLocalStorage<ProjectItem[]>(
    "college_life_portfolio_projects_v2",
    INITIAL_PROJECTS
  );

  const [certifications, setCertifications] = useLocalStorage<CertificationItem[]>(
    "college_life_portfolio_certs_v2",
    INITIAL_CERTIFICATIONS
  );

  const [skills, setSkills] = useLocalStorage<SkillItem[]>(
    "college_life_portfolio_skills_v2",
    INITIAL_SKILLS
  );

  // Preview Mode
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<"profile" | "projects" | "certifications" | "skills">("profile");

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = React.useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = React.useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = React.useState(false);

  // Project form fields
  const [editingProjectId, setEditingProjectId] = React.useState<string | null>(null);
  const [projectTitle, setProjectTitle] = React.useState("");
  const [projectTerm, setProjectTerm] = React.useState("Fall 2024");
  const [projectDesc, setProjectDesc] = React.useState("");
  const [projectTech, setProjectTech] = React.useState("");
  const [projectLink, setProjectLink] = React.useState("");
  const [projectGithub, setProjectGithub] = React.useState("");

  // Certification form fields
  const [editingCertId, setEditingCertId] = React.useState<string | null>(null);
  const [certName, setCertName] = React.useState("");
  const [certIssuer, setCertIssuer] = React.useState("");
  const [certDate, setCertDate] = React.useState("");
  const [certIdNum, setCertIdNum] = React.useState("");

  // Skill form field
  const [newSkillName, setNewSkillName] = React.useState("");
  const [newSkillCategory, setNewSkillCategory] = React.useState("Languages");

  // Share link handler
  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Portfolio link copied to clipboard. Ready to share with recruiters.",
        variant: "success",
      });
    }
  };

  // Download PDF via Browser Print
  const handleDownloadPDF = () => {
    toast({
      title: "Generating Print PDF...",
      description: "Select 'Save as PDF' in the print preview dialog.",
    });
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Save Profile Details
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileModalOpen(false);
    toast({
      title: "Profile Saved",
      description: "Updated your academic bio, major, and social links.",
      variant: "success",
    });
  };

  // Save Project
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    const techArray = projectTech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProjectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProjectId
            ? {
                ...p,
                title: projectTitle.trim(),
                term: projectTerm.trim(),
                description: projectDesc.trim(),
                technologies: techArray.length ? techArray : ["React", "TypeScript"],
                link: projectLink.trim() || undefined,
                githubUrl: projectGithub.trim() || undefined,
              }
            : p
        )
      );
      toast({ title: "Project Updated", description: `Saved changes to "${projectTitle}"`, variant: "success" });
    } else {
      const newProj: ProjectItem = {
        id: `proj-${Math.random().toString(36).slice(2, 9)}`,
        type: "project",
        title: projectTitle.trim(),
        term: projectTerm.trim(),
        description: projectDesc.trim(),
        technologies: techArray.length ? techArray : ["Next.js", "Tailwind"],
        link: projectLink.trim() || undefined,
        githubUrl: projectGithub.trim() || undefined,
      };
      setProjects((prev) => [newProj, ...prev]);
      toast({ title: "Project Added", description: `Added "${projectTitle}" to portfolio`, variant: "success" });
    }
    setIsProjectModalOpen(false);
  };

  // Delete Project
  const handleDeleteProject = (id: string, title: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Project Deleted", description: `Removed "${title}"`, variant: "warning" });
  };

  // Save Certification
  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim()) return;

    if (editingCertId) {
      setCertCertifications(editingCertId);
    } else {
      const newCert: CertificationItem = {
        id: `cert-${Math.random().toString(36).slice(2, 9)}`,
        type: "certification",
        name: certName.trim(),
        issuer: certIssuer.trim() || "Industry Credential",
        issueDate: certDate.trim() || "2024",
        credentialId: certIdNum.trim() || undefined,
      };
      setCertifications((prev) => [newCert, ...prev]);
      toast({ title: "Certification Added", description: `Added "${certName}"`, variant: "success" });
    }
    setIsCertModalOpen(false);
  };

  const setCertCertifications = (id: string) => {
    setCertifications((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: certName.trim(),
              issuer: certIssuer.trim(),
              issueDate: certDate.trim(),
              credentialId: certIdNum.trim() || undefined,
            }
          : c
      )
    );
    toast({ title: "Certification Updated", description: `Saved changes to "${certName}"`, variant: "success" });
  };

  // Delete Certification
  const handleDeleteCert = (id: string, name: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Certification Deleted", description: `Removed "${name}"`, variant: "warning" });
  };

  // Add Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const newSkill: SkillItem = {
      id: `sk-${Math.random().toString(36).slice(2, 9)}`,
      type: "skill",
      name: newSkillName.trim(),
      category: newSkillCategory,
    };
    setSkills((prev) => [...prev, newSkill]);
    setNewSkillName("");
    setIsSkillModalOpen(false);
    toast({ title: "Skill Added", description: `Added "${newSkill.name}"`, variant: "success" });
  };

  // Delete Skill
  const handleDeleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 print-page">
      {/* Header (hidden in print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#635BFF] uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" /> Academic Showcase • Verified Student
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Student Academic Portfolio
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant={isPreviewMode ? "primary" : "outline"}
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="rounded-xl gap-1.5 text-xs font-semibold h-9"
          >
            {isPreviewMode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {isPreviewMode ? "Exit Preview" : "Preview Portfolio"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareLink}
            className="rounded-xl gap-1.5 text-xs font-semibold h-9 border-border bg-white dark:bg-surface"
          >
            <Share2 className="h-3.5 w-3.5" /> Share Link
          </Button>
          <Button
            size="sm"
            onClick={handleDownloadPDF}
            className="rounded-xl bg-[#635BFF] hover:bg-[#5046E5] text-white gap-1.5 font-bold text-xs h-9 shadow-sm shadow-[#635BFF]/25"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Tabs Row (hidden in print) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-print">
        {[
          { id: "profile", label: "👤 Profile" },
          { id: "projects", label: `📁 Projects (${projects.length})` },
          { id: "certifications", label: `🎖️ Certifications (${certifications.length})` },
          { id: "skills", label: `⚡ Skills (${skills.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-[#635BFF] text-white shadow-xs"
                : "bg-white dark:bg-surface border border-border text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 1: Scholar Profile Card */}
      <Card className="p-6 md:p-8 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-6 print-break-inside-avoid">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-tr from-[#635BFF] to-[#A29BFE] text-white flex items-center justify-center text-3xl font-black shadow-md ring-4 ring-white dark:ring-surface shrink-0">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "AR"}
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#00D287] border-3 border-white dark:border-surface" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 text-xs font-bold">
                  Undergraduate Scholar
                </span>
                <span className="rounded-full bg-[#E8FAF5] dark:bg-[#00D287]/20 text-[#00B894] px-2.5 py-0.5 text-xs font-bold">
                  Dean&apos;s Honor List
                </span>
                {!isPreviewMode && (
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="p-1 rounded-lg text-slate-400 hover:text-[#635BFF] hover:bg-slate-100 dark:hover:bg-slate-800 no-print"
                    title="Edit Profile"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {profile.name}
              </h2>
              <p className="text-sm font-bold text-[#635BFF]">
                B.S. Computer Science & Human-Computer Interaction
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {profile.institution} • Class of {profile.classYear} •{" "}
                <strong className="text-foreground">GPA {profile.gpa} / 4.00</strong>
              </p>
            </div>
          </div>

          {/* Stats widget */}
          <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 self-stretch md:self-auto justify-around">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900 dark:text-white">{projects.length}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Featured Apps</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900 dark:text-white">{certifications.length}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Credentials</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900 dark:text-white">{skills.length}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Tech Skills</p>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {profile.bio}
        </p>

        {/* Social / Contact Links */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#635BFF]"
            >
              <Github className="h-3.5 w-3.5" /> github.com/alexrivera
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#635BFF]"
            >
              <Linkedin className="h-3.5 w-3.5" /> linkedin.com/in/alex-rivera-cs
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#635BFF]"
            >
              <Mail className="h-3.5 w-3.5" /> {profile.email}
            </a>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8FAF5] dark:bg-[#00D287]/20 text-[#00B894] text-xs font-bold">
            🟢 {profile.statusTag || "Open for Summer 2025 SDE Internships"}
          </span>
        </div>
      </Card>

      {/* Section 2: Featured Projects */}
      <div className="space-y-4 print-break-inside-avoid">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            💻 Featured Projects ({projects.length})
          </h3>
          {!isPreviewMode && (
            <Button
              size="sm"
              onClick={() => {
                setEditingProjectId(null);
                setProjectTitle("");
                setProjectTerm("Fall 2024");
                setProjectDesc("");
                setProjectTech("");
                setProjectLink("");
                setProjectGithub("");
                setIsProjectModalOpen(true);
              }}
              className="rounded-xl text-xs font-bold gap-1.5 no-print"
            >
              <Plus className="h-3.5 w-3.5" /> Add Project
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((proj, idx) => {
            const gradients = [
              "from-blue-600 to-indigo-800",
              "from-emerald-600 to-teal-800",
              "from-purple-600 to-pink-800",
            ];
            const bgGrad = gradients[idx % gradients.length];

            return (
              <Card
                key={proj.id}
                className="rounded-3xl overflow-hidden border-border bg-white dark:bg-surface shadow-xs flex flex-col justify-between"
              >
                <div className={`h-32 bg-gradient-to-tr ${bgGrad} p-4 flex items-end justify-between text-white relative`}>
                  <Badge variant="primary" size="sm" className="bg-white/20 text-white border-0 backdrop-blur-md">
                    {proj.term || "Production"}
                  </Badge>
                  {!isPreviewMode && (
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-lg p-1 no-print">
                      <button
                        onClick={() => {
                          setEditingProjectId(proj.id);
                          setProjectTitle(proj.title);
                          setProjectTerm(proj.term || "Fall 2024");
                          setProjectDesc(proj.description);
                          setProjectTech(proj.technologies.join(", "));
                          setProjectLink(proj.link || "");
                          setProjectGithub(proj.githubUrl || "");
                          setIsProjectModalOpen(true);
                        }}
                        className="p-1 hover:text-[#635BFF] transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        className="p-1 hover:text-[#FF5252] transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-1 border-t border-border/60 text-xs font-semibold text-[#635BFF]">
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          Live Demo <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 hover:underline"
                        >
                          GitHub <Github className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section 3: Certifications & Skills Grid */}
      <div className="grid gap-6 md:grid-cols-2 print-break-inside-avoid">
        {/* Certifications Card */}
        <Card className="p-6 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-[#635BFF]" /> Industry Certifications ({certifications.length})
            </h3>
            {!isPreviewMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingCertId(null);
                  setCertName("");
                  setCertIssuer("");
                  setCertDate(new Date().getFullYear().toString());
                  setCertIdNum("");
                  setIsCertModalOpen(true);
                }}
                className="h-8 rounded-xl text-xs gap-1 no-print"
              >
                <Plus className="h-3 w-3" /> Add
              </Button>
            )}
          </div>

          <div className="space-y-3 text-xs">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{cert.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {cert.issuer} • {cert.issueDate} {cert.credentialId && `• ID: ${cert.credentialId}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-[#00D287]" />
                  {!isPreviewMode && (
                    <button
                      onClick={() => handleDeleteCert(cert.id, cert.name)}
                      className="text-slate-400 hover:text-[#FF5252] p-1 no-print"
                      title="Delete certification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Skills Card */}
        <Card className="p-6 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#635BFF]" /> Technical Competencies
            </h3>
            {!isPreviewMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewSkillName("");
                  setIsSkillModalOpen(true);
                }}
                className="h-8 rounded-xl text-xs gap-1 no-print"
              >
                <Plus className="h-3 w-3" /> Add Skill
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Programming Languages
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skills
                  .filter((s) => s.category === "Languages")
                  .map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      {s.name}
                      {!isPreviewMode && (
                        <button
                          onClick={() => handleDeleteSkill(s.id)}
                          className="text-slate-400 hover:text-[#FF5252] no-print"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Frameworks & Developer Tools
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skills
                  .filter((s) => s.category !== "Languages")
                  .map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      {s.name}
                      {!isPreviewMode && (
                        <button
                          onClick={() => handleDeleteSkill(s.id)}
                          className="text-slate-400 hover:text-[#FF5252] no-print"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating Preview Mode Banner (bottom of screen, hidden in print) */}
      {isPreviewMode && (
        <div className="fixed bottom-4 inset-x-4 max-w-2xl mx-auto z-50 rounded-2xl bg-slate-900 text-white p-4 shadow-elevated flex items-center justify-between gap-3 animate-fade-in no-print">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#635BFF] text-white font-bold">
              👁️
            </span>
            <span>
              <strong>Preview Mode Active</strong> — This is how recruiters and professors view your public portfolio.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleShareLink}
              className="h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold"
            >
              Copy Public URL ↗
            </Button>
            <button
              onClick={() => setIsPreviewMode(false)}
              className="text-slate-400 hover:text-white p-1"
              title="Close Preview Mode"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal: Edit Profile */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="✏️ Edit Scholar Profile"
        description="Update your bio, GPA, and social links"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                GPA
              </label>
              <input
                type="text"
                value={profile.gpa}
                onChange={(e) => setProfile({ ...profile, gpa: e.target.value })}
                required
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Institution / College
              </label>
              <input
                type="text"
                value={profile.institution}
                onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Class Year
              </label>
              <input
                type="text"
                value={profile.classYear}
                onChange={(e) => setProfile({ ...profile, classYear: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Bio Summary
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 rounded-xl border border-input bg-surface text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">GitHub</label>
              <input
                type="text"
                value={profile.github || ""}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className="w-full h-9 px-2.5 rounded-lg border border-input bg-surface text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">LinkedIn</label>
              <input
                type="text"
                value={profile.linkedin || ""}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className="w-full h-9 px-2.5 rounded-lg border border-input bg-surface text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email</label>
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full h-9 px-2.5 rounded-lg border border-input bg-surface text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold">
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add/Edit Project */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title={editingProjectId ? "✏️ Edit Project" : "💻 Add Featured Project"}
        description="Showcase course assignments, hackathon apps, or open source repositories"
      >
        <form onSubmit={handleSaveProject} className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Project Title
            </label>
            <input
              type="text"
              placeholder="e.g., CampusEats: Dining Hall Tracker"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Term / Semester
              </label>
              <input
                type="text"
                placeholder="e.g., Fall 2024"
                value={projectTerm}
                onChange={(e) => setProjectTerm(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Technologies (comma separated)
              </label>
              <input
                type="text"
                placeholder="React, TypeScript, Tailwind"
                value={projectTech}
                onChange={(e) => setProjectTech(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Explain the problem solved, architecture decisions, and features..."
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-input bg-surface text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Live Demo URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://myproject.app"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={projectGithub}
                onChange={(e) => setProjectGithub(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsProjectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold">
              Save Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add/Edit Certification */}
      <Modal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        title={editingCertId ? "🎖️ Edit Certification" : "🎖️ Add Certification"}
        description="Record course certificates, AWS/cloud licenses, or honors"
      >
        <form onSubmit={handleSaveCert} className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Certificate Name
            </label>
            <input
              type="text"
              placeholder="e.g., AWS Certified Cloud Practitioner"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Issuer / Organization
              </label>
              <input
                type="text"
                placeholder="e.g., Amazon Web Services"
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Issue Date
              </label>
              <input
                type="text"
                placeholder="e.g., Aug 2024"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Credential ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., AWS-8921-X9K"
              value={certIdNum}
              onChange={(e) => setCertIdNum(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCertModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold">
              Save Certification
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Skill */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title="⚡ Add Technical Skill"
        description="Add a language, library, or framework tag"
      >
        <form onSubmit={handleAddSkill} className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Skill Name
            </label>
            <input
              type="text"
              placeholder="e.g., Rust, GraphQL, or PyTorch"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
            >
              <option value="Languages">Programming Languages</option>
              <option value="Frameworks">Frameworks & Libraries</option>
              <option value="Developer Tools">Developer Tools & Cloud</option>
              <option value="Design">UI/UX & Design</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsSkillModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold">
              Add Skill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
