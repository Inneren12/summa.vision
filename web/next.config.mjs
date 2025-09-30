
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: { providerImportSource: "@mdx-js/react" }
});

const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: { externalDir: true },
  output: "export"
};

export default withMDX(nextConfig);
