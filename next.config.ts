import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/request-estimate", destination: "/contact", permanent: true },
      { source: "/services/vinyl-windows", destination: "/services/window-glass-replacement", permanent: true },
      { source: "/blog/benefits-of-modern-vinyl-windows", destination: "/blog/signs-your-window-glass-needs-replacement", permanent: true },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
