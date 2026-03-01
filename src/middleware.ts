export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/lessons/:path*",
    "/booking/:path*",
    "/progress/:path*",
    "/ai-feedback/:path*",
    "/api/booking/:path*",
    "/api/progress/:path*",
    "/api/ai-feedback/:path*",
  ],
};
