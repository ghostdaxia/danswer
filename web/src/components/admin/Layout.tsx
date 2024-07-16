import { Header } from "@/components/header/Header";
import { AdminSidebar } from "@/components/admin/connectors/AdminSidebar";
import {
  NotebookIcon,
  UsersIcon,
  ThumbsUpIcon,
  BookmarkIcon,
  ZoomInIcon,
  RobotIcon,
  ConnectorIcon,
} from "@/components/icons/icons";
import { User } from "@/lib/types";
import {
  AuthTypeMetadata,
  getAuthTypeMetadataSS,
  getCurrentUserSS,
} from "@/lib/userSS";
import { redirect } from "next/navigation";
import { FiCpu, FiPackage, FiSettings, FiSlack, FiTool } from "react-icons/fi";

export async function Layout({ children }: { children: React.ReactNode }) {
  const tasks = [getAuthTypeMetadataSS(), getCurrentUserSS()];

  // catch cases where the backend is completely unreachable here
  // without try / catch, will just raise an exception and the page
  // will not render
  let results: (User | AuthTypeMetadata | null)[] = [null, null];
  try {
    results = await Promise.all(tasks);
  } catch (e) {
    console.log(`Some fetch failed for the main search page - ${e}`);
  }

  const authTypeMetadata = results[0] as AuthTypeMetadata | null;
  const user = results[1] as User | null;

  const authDisabled = authTypeMetadata?.authType === "disabled";
  const requiresVerification = authTypeMetadata?.requiresVerification;
  if (!authDisabled) {
    if (!user) {
      return redirect("/auth/login");
    }
    if (user.role !== "admin") {
      return redirect("/");
    }
    if (!user.is_verified && requiresVerification) {
      return redirect("/auth/waiting-on-verification");
    }
  }

  return (
    <div className="h-screen overflow-y-hidden">
      <div className="absolute top-0 z-50 w-full">
        <Header user={user} />
      </div>
      <div className="flex h-full pt-16">
        <div className="w-80 pt-12 pb-8 h-full border-r border-border">
          <AdminSidebar
            collections={[
              {
                name: "连接器",
                items: [
                  {
                    name: (
                      <div className="flex">
                        <NotebookIcon size={18} />
                        <div className="ml-1">现有连接器</div>
                      </div>
                    ),
                    link: "/admin/indexing/status",
                  },
                  {
                    name: (
                      <div className="flex">
                        <ConnectorIcon size={18} />
                        <div className="ml-1.5">增加连接器</div>
                      </div>
                    ),
                    link: "/admin/add-connector",
                  },
                ],
              },
              {
                name: "文档管理",
                items: [
                  {
                    name: (
                      <div className="flex">
                        <BookmarkIcon size={18} />
                        <div className="ml-1">文档集</div>
                      </div>
                    ),
                    link: "/admin/documents/sets",
                  },
                  {
                    name: (
                      <div className="flex">
                        <ZoomInIcon size={18} />
                        <div className="ml-1">资源管理器</div>
                      </div>
                    ),
                    link: "/admin/documents/explorer",
                  },
                  {
                    name: (
                      <div className="flex">
                        <ThumbsUpIcon size={18} />
                        <div className="ml-1">反馈</div>
                      </div>
                    ),
                    link: "/admin/documents/feedback",
                  },
                ],
              },
              {
                name: "自定义助手",
                items: [
                  {
                    name: (
                      <div className="flex">
                        <RobotIcon size={18} />
                        <div className="ml-1">助手</div>
                      </div>
                    ),
                    link: "/admin/assistants",
                  },
                  // {
                  //   name: (
                  //     <div className="flex">
                  //       <FiSlack size={18} />
                  //       <div className="ml-1">Slack Bots</div>
                  //     </div>
                  //   ),
                  //   link: "/admin/bot",
                  // },
                  {
                    name: (
                      <div className="flex">
                        <FiTool size={18} className="my-auto" />
                        <div className="ml-1">Tools</div>
                      </div>
                    ),
                    link: "/admin/tools",
                  },
                ],
              },
              {
                name: "模型配置",
                items: [
                  {
                    name: (
                      <div className="flex">
                        <FiCpu size={18} />
                        <div className="ml-1">LLM</div>
                      </div>
                    ),
                    link: "/admin/models/llm",
                  },
                  {
                    name: (
                      <div className="flex">
                        <FiPackage size={18} />
                        <div className="ml-1">Embedding</div>
                      </div>
                    ),
                    link: "/admin/models/embedding",
                  },
                ],
              },
              {
                name: "用户管理",
                items: [
                  {
                    name: (
                      <div className="flex">
                        <UsersIcon size={18} />
                        <div className="ml-1">用户</div>
                      </div>
                    ),
                    link: "/admin/users",
                  },
                ],
              },
              {
                name: "系统设置",
                items: [
                  {
                    name: (
                      <div className="flex">
                        <FiSettings size={18} />
                        <div className="ml-1">工作空间设置</div>
                      </div>
                    ),
                    link: "/admin/settings",
                  },
                ],
              },
            ]}
          />
        </div>
        <div className="px-12 pt-8 pb-8 h-full overflow-y-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
