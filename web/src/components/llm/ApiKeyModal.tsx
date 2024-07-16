"use client";

import { useState, useEffect } from "react";
import { ApiKeyForm } from "./ApiKeyForm";
import { Modal } from "../Modal";
import { WellKnownLLMProviderDescriptor } from "@/app/admin/models/llm/interfaces";
import { checkLlmProvider } from "../initialSetup/welcome/lib";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";

export const ApiKeyModal = ({ user }: { user: User | null }) => {
  const router = useRouter();

  const [forceHidden, setForceHidden] = useState<boolean>(false);
  const [validProviderExists, setValidProviderExists] = useState<boolean>(true);
  const [providerOptions, setProviderOptions] = useState<
    WellKnownLLMProviderDescriptor[]
  >([]);

  useEffect(() => {
    async function fetchProviderInfo() {
      const { providers, options, defaultCheckSuccessful } =
        await checkLlmProvider(user);
      setValidProviderExists(providers.length > 0 && defaultCheckSuccessful);
      setProviderOptions(options);
    }

    fetchProviderInfo();
  }, []);

  // don't show if
  //  (1) a valid provider has been setup or
  //  (2) there are no provider options (e.g. user isn't an admin)
  //  (3) user explicitly hides the modal
  if (validProviderExists || !providerOptions.length || forceHidden) {
    return null;
  }

  return (
    <Modal
      title="LLM Key Setup"
      className="max-w-4xl"
      onOutsideClick={() => setForceHidden(true)}
    >
      <div className="max-h-[75vh] overflow-y-auto flex flex-col px-4">
        <div>
          <div className="mb-5 text-sm">
            请在下面设置一个LLM，以便开始使用毕方搜索或毕方会话。
            不用担心，您可以随时在管理员面板中更改此设置。
            <br />
            <br />
            或者您可以先浏览一下平台功能,{" "}
            <strong
              onClick={() => setForceHidden(true)}
              className="text-link cursor-pointer"
            >
              跳过这一步。
            </strong>
            .
          </div>

          <ApiKeyForm
            onSuccess={() => {
              router.refresh();
              setForceHidden(true);
            }}
            providerOptions={providerOptions}
          />
        </div>
      </div>
    </Modal>
  );
};
