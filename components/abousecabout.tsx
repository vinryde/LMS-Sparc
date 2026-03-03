import { About3 } from "@/components/about-3";

const DemoAbout = () => {
  return (
    <About3
      title="About Us"
      description="SPARC II funded CREATE project promoting international collaboration in climate science research, energy education, and ecological sustainability between Indian and global institutions."
      mainImage={{
        src: "/sparcabout.png",
        alt: "placeholder",
      }}
      secondaryImage={{
        src: "/aboutsecc.png",
        alt: "placeholder",
      }}
      breakout={{
        src: "/create_logo.png",
        alt: "CREATE mission",
        title: "Advancing Climate & Energy Education",
        description:
          "CREATE aims to advance climate science research, energy education, and ecological sustainability through international collaboration between Indian and global institutions.",
        buttonText: "Discover courses",
        buttonUrl: "/courses",
      }}
      companiesTitle="In collaboration with"
      companies={[
        { src: "/ku.png", alt: "Kerala university-1" },
  { src: "/sparc.png", alt: "Sparc Logo-1" },
  { src: "/southampton.png", alt: "Southampton University Logo-1" },
  { src: "/mgu.png", alt: "mahatma gandhi university" },
  { src: "/clarkson.png", alt: "Clarkson university" },
      ]}
      achievementsTitle="Our Impact in Numbers"
achievementsDescription="Advancing climate science and energy education through structured modules, research-driven learning, and collaborative initiatives."
achievements={[
  { label: "Specialized Courses", value: "2" },
  { label: "Structured Learning Modules", value: "20+" },
  { label: "Interactive Activities", value: "300+" },
  { label: "Resources", value: "300+" },
]
      }
    />
  );
};

export { DemoAbout };
