import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        return { user: data.user };
      }
    } catch (e) {
      console.warn("[Auth] Supabase auth check error:", e);
    }

    if (typeof window !== "undefined") {
      const demoRaw = localStorage.getItem("cf_demo_user");
      if (demoRaw) {
        try {
          const demoUser = JSON.parse(demoRaw);
          return { user: demoUser };
        } catch {}
      }
    }

    throw redirect({
      to: "/auth",
      search: { redirect: location.href },
    });
  },
  component: () => <Outlet />,
});
