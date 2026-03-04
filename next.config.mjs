/** @type {import('next').NextConfig} */
const nextConfig = {
  // Todo: Refactor to use Next 16 cache components
  async headers() {
    const embedFrameAncestors =
      "https://andreasbusk.dk https://www.andreasbusk.dk http://localhost:3000";

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'",
          },
        ],
      },
      {
        source: "/demo/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${embedFrameAncestors}`,
          },
        ],
      },
      {
        source: "/dashboard/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${embedFrameAncestors}`,
          },
        ],
      },
      {
        source: "/sets/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${embedFrameAncestors}`,
          },
        ],
      },
      {
        source: "/study/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${embedFrameAncestors}`,
          },
        ],
      },
      {
        source: "/settings/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${embedFrameAncestors}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
