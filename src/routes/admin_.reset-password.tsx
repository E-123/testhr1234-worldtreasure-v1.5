import { createFileRoute } from "@tanstack/react-router";
import AdminResetPassword from "@/components/pages/AdminResetPassword";

export const Route = createFileRoute("/admin_/reset-password")({
  head: () => ({
    meta: [
      { title: "重置管理员密码 | 世界瑰宝艺术协会" },
      { name: "description", content: "为世界瑰宝艺术协会管理员账号设置新密码。" },
      { property: "og:title", content: "重置管理员密码 | 世界瑰宝艺术协会" },
      { property: "og:description", content: "为世界瑰宝艺术协会管理员账号设置新密码。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminResetPassword,
});
