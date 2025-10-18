"use client";

import type { ComponentPropsWithoutRef, ReactElement } from "react";

type MDXComponent = (props: Record<string, unknown>) => ReactElement;
type MDXComponents = Record<string, MDXComponent>;

type Heading1Props = ComponentPropsWithoutRef<"h1">;
type Heading2Props = ComponentPropsWithoutRef<"h2">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    h1: ((props: Heading1Props) => (
      <h1 className="text-3xl font-semibold mt-6 mb-4" {...props} />
    )) as MDXComponent,
    h2: ((props: Heading2Props) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
    )) as MDXComponent,
    p: ((props: ParagraphProps) => (
      <p className="my-3 leading-7 opacity-90" {...props} />
    )) as MDXComponent,
    ...components,
  };
}
