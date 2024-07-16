"use client";

import { errorHandlingFetcher, FetchError, RedirectError } from "@/lib/fetcher";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Modal } from "../Modal";

export const HealthCheckBanner = () => {
  const router = useRouter();
  const { error } = useSWR("/api/health", errorHandlingFetcher);

  if (!error) {
    return null;
  }

  if (error instanceof RedirectError) {
    return (
      <Modal
        width="w-1/4"
        className="overflow-y-hidden flex flex-col"
        title="您已被注销！"
      >
        <div className="flex flex-col gap-y-4">
          <p className="text-lg ">
            您可以点击&quot;登录&quot;重新登录！对于给您带来的不便，我们深表歉意。
          </p>
          <a
            href="/auth/login"
            className="w-full mt-4 mx-auto rounded-md text-neutral-200 py-2 bg-neutral-800 text-center hover:bg-neutral-700 animtate duration-300 transition-bg  "
          >
            登录
          </a>
        </div>
      </Modal>
    );
  } else {
    return (
      <div className="text-xs mx-auto bg-gradient-to-r from-red-900 to-red-700 p-2 rounded-sm border-hidden text-gray-300">
        <p className="font-bold pb-1">后端服务当前不可用。</p>

        <p className="px-1">
          如果这是您的初始设置，或者您刚刚更新了平台部署，这可能是因为后端仍在启动。
          请稍等片刻，然后刷新页面。
          如果还是不能工作，请确保后端服务已启动，或联系管理员。
        </p>
      </div>
    );
  }
};
