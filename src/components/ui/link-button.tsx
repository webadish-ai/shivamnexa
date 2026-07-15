import Link from "next/link";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
} & VariantProps<typeof buttonVariants>;

export function LinkButton({ href, children, className, variant, size, target, rel }: Props) {
  const isExternal = href.startsWith("http") || href.startsWith("https") || href.startsWith("tel") || href.startsWith("mailto");
  if (isExternal) {
    return (
      <a href={href} target={target} rel={rel} className={cn(buttonVariants({ variant, size }), className)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>
      {children}
    </Link>
  );
}
