import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white shadow hover:bg-primary/80",
        outline: "bg-white text-primary border border-primary hover:bg-primary/10",
        secondary: "bg-white text-black border border-black hover:bg-black/10",
        "secondary-inverse": "bg-black text-white border border-white hover:bg-white/10",
        destructive: "border-transparent bg-destructive text-white shadow hover:bg-destructive/80",
        "destructive-inverse": "bg-white text-destructive border border-destructive hover:bg-destructive/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
