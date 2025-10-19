import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

type ComponentsInput =
  | MDXComponents
  | ((current: MDXComponents) => MDXComponents)
  | null
  | undefined;

const DEFAULT_COMPONENTS: MDXComponents = {
  h1: (props) => <h1 className="text-3xl font-semibold mt-6 mb-4" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
  p: (props) => <p className="my-3 leading-7 opacity-90" {...props} />,
};

const stack: MDXComponents[] = [DEFAULT_COMPONENTS];

function mergeComponents(base: MDXComponents, components?: ComponentsInput): MDXComponents {
  if (typeof components === "function") {
    return components(base);
  }
  if (components) {
    return { ...base, ...components };
  }
  return base;
}

export function useMDXComponents(components?: ComponentsInput): MDXComponents {
  const current = stack[stack.length - 1] ?? DEFAULT_COMPONENTS;
  return mergeComponents(current, components);
}

export function MDXProvider({
  components,
  disableParentContext,
  children,
}: {
  components?: ComponentsInput;
  disableParentContext?: boolean | null;
  children?: ReactNode;
}) {
  const parent = disableParentContext ? DEFAULT_COMPONENTS : stack[stack.length - 1];
  const value = mergeComponents(parent ?? DEFAULT_COMPONENTS, components);
  stack.push(value);
  try {
    return children ?? null;
  } finally {
    stack.pop();
  }
}
