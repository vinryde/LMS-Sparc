import { cn } from "@/lib/utils";
import { LogoCloud } from "@/components/logo-cloud-3";

export default function LogoOne() {
  return (
    <div className="relative py-16 w-full overflow-hidden flex flex-col items-center">
      <div
        aria-hidden="true"
        className={cn(
          "-z-10 -top-1/2 left-1/2 -translate-x-1/2 pointer-events-none absolute h-[120vmin] w-[120vmin] max-w-full rounded-b-full hidden md:block",
          "bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]",
          "blur-[30px]"
        )}
      />

      <section className="relative mx-auto max-w-3xl w-full px-0 overflow-hidden"> {/* ← px-0, let children handle padding */}
        <h2 className="mb-5 text-center font-medium text-foreground text-xl tracking-tight md:text-3xl px-4"> {/* ← px-4 moved here */}
          <span className="text-muted-foreground">Backed by global partnerships.</span>
          <br />
          <span className="font-semibold">Trusted by educators.</span>
        </h2>
        <div className="mx-auto my-5 h-px max-w-sm bg-border px-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />

        <LogoCloud logos={logos} /> {/* ← removed className="overflow-hidden", handled inside */}

        <div className="mt-5 h-px bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
      </section>
    </div>
  );
}

const logos = [
  { src: "/ku.png", alt: "Kerala university-1" },
  { src: "/sparc.png", alt: "Sparc Logo-1" },
  { src: "/southampton.png", alt: "Southampton University Logo-1" },
  { src: "/mgu.png", alt: "mahatma gandhi university" },
  { src: "/clarkson.png", alt: "Clarkson university" },
];