import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative w-full py-4",   // ← no overflow-hidden here; let InfiniteSlider own it
        "[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]", // ← tighter fade stops for narrow screens
        className
      )}
      style={{ maxWidth: '100vw', overflow: 'hidden' }} // ← hard clip to viewport
    >
      <InfiniteSlider gap={42} reverse duration={25} durationOnHover={40}>
        {logos.map((logo) => (
          <img
            alt={logo.alt}
            className="pointer-events-none h-12 select-none md:h-16 dark:brightness-0 dark:invert"
            height={logo.height ?? "auto"}
            key={`logo-${logo.alt}`}
            loading="lazy"
            src={logo.src}
            width={logo.width ?? "auto"}
          />
        ))}
      </InfiniteSlider>
    </div>
  );
}