import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer, Download } from "lucide-react";

interface WorkExperience {
  company: string;
  role: string;
  description?: string;
  duration: string;
  location: string;
  link?: string;
}

interface Education {
  institution: string;
  degree: string;
  duration: string;
  location: string;
  link?: string;
}

const resumeData = {
  name: "Atharv Shukla",
  title: "Full Stack Developer & Designer",
  location: "Mumbai, India",
  workExperience: [
    {
      company: "TechVision Inc",
      role: "Senior Full Stack Developer",
      description: "Led development of cloud-based applications using React, Node.js, and AWS. Architected scalable solutions serving 100K+ users.",
      duration: "January 2022 - Present",
      location: "Remote",
      link: "https://techvision.com"
    },
    {
      company: "CreativeStudio",
      role: "Full Stack Developer",
      description: "Built responsive web applications and mobile apps. Collaborated with designers to create pixel-perfect implementations.",
      duration: "June 2020 - December 2021",
      location: "Mumbai, India",
      link: "https://creativestudio.com"
    },
    {
      company: "Freelance",
      role: "Web Developer & Designer",
      description: "Worked with various clients to deliver custom web solutions. Specialized in React, Next.js, and modern UI/UX design.",
      duration: "March 2019 - May 2020",
      location: "India",
    }
  ],
  education: [
    {
      institution: "University of Mumbai",
      degree: "Bachelor of Engineering in Computer Science",
      duration: "August 2015 - May 2019",
      location: "Mumbai, India",
      link: "https://mu.ac.in"
    }
  ],
  languages: ["English (Fluent)", "Hindi (Native)", "Marathi (Native)"],
  skills: [
    "React", "Next.js", "TypeScript", "Node.js", "Python", 
    "PostgreSQL", "MongoDB", "AWS", "Docker", "GraphQL",
    "Tailwind CSS", "Figma", "Adobe XD", "Git", "CI/CD"
  ]
};

export const Resume = () => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    alert("PDF download functionality would be implemented here");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h2 className="text-3xl font-bold mb-2">Resume</h2>
          <p className="text-muted-foreground">
            Professional experience and qualifications
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleDownload}
            className="gap-2"
            data-testid="button-download-resume"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button 
            onClick={handlePrint}
            className="gap-2"
            data-testid="button-print-resume"
          >
            <Printer className="w-4 h-4" />
            Print Resume
          </Button>
        </div>
      </div>

      {/* Resume Preview Card */}
      <Card className="p-8 md:p-12 shadow-lg" data-testid="card-resume-preview">
        <div id="resume-content" className="resume-content">
          {/* Header */}
          <header className="mb-10 border-b-2 border-border pb-6">
            <h1 className="text-4xl font-bold mb-2" data-testid="text-resume-name">{resumeData.name}</h1>
            <h2 className="text-xl text-muted-foreground font-medium mb-1">{resumeData.title}</h2>
            <p className="text-sm text-muted-foreground">{resumeData.location}</p>
          </header>

          {/* Work Experience */}
          <section className="mb-10">
            <h3 className="text-2xl font-semibold border-b-2 border-border pb-3 mb-6">
              Work Experience
            </h3>
            {resumeData.workExperience.map((work: WorkExperience, idx: number) => (
              <div key={idx} className="mb-7 last:mb-0" data-testid={`work-experience-${idx}`}>
                <h4 className="text-lg font-semibold mb-1">
                  {work.link ? (
                    <a 
                      href={work.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors no-underline text-foreground"
                      data-testid={`link-company-${idx}`}
                    >
                      {work.company}
                    </a>
                  ) : (
                    work.company
                  )}
                </h4>
                <p className="font-medium text-foreground mb-2">{work.role}</p>
                {work.description && (
                  <p className="text-muted-foreground mb-2 leading-relaxed">
                    {work.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {work.duration} | {work.location}
                </p>
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="mb-10">
            <h3 className="text-2xl font-semibold border-b-2 border-border pb-3 mb-6">
              Education
            </h3>
            {resumeData.education.map((edu: Education, idx: number) => (
              <div key={idx} className="mb-6 last:mb-0" data-testid={`education-${idx}`}>
                <h4 className="text-lg font-semibold mb-1">
                  {edu.link ? (
                    <a 
                      href={edu.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors no-underline text-foreground"
                      data-testid={`link-institution-${idx}`}
                    >
                      {edu.institution}
                    </a>
                  ) : (
                    edu.institution
                  )}
                </h4>
                <p className="font-medium text-foreground mb-2">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">
                  {edu.duration} | {edu.location}
                </p>
              </div>
            ))}
          </section>

          {/* Languages */}
          <section className="mb-10">
            <h3 className="text-2xl font-semibold border-b-2 border-border pb-3 mb-4">
              Languages
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              {resumeData.languages.map((lang: string, idx: number) => (
                <li key={idx}>{lang}</li>
              ))}
            </ul>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-2xl font-semibold border-b-2 border-border pb-3 mb-4">
              Skills
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {resumeData.skills.join(", ")}
            </p>
          </section>
        </div>
      </Card>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-content, #resume-content * {
            visibility: visible;
          }
          #resume-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
