"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import Ripple from "magic-ui-react/ripple";

export function RippleButton({ children, ...props }: ButtonProps) {
  return (
    <Button {...props}>
      {children}
      <Ripple />
    </Button>
  );
}
