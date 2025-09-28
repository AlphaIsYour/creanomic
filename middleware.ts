/* eslint-disable @typescript-eslint/no-unused-vars */
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }

        // Allow access to auth pages only if not authenticated
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return !token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
