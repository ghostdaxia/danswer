"use client";

import { Button, Divider, Text } from "@tremor/react";
import { Modal } from "../../Modal";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { COMPLETED_WELCOME_FLOW_COOKIE } from "./constants";
import { FiCheckCircle, FiMessageSquare, FiShare2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/BackButton";
import { ApiKeyForm } from "@/components/llm/ApiKeyForm";
import { WellKnownLLMProviderDescriptor } from "@/app/admin/models/llm/interfaces";
import { checkLlmProvider } from "./lib";
import { User } from "@/lib/types";

function setWelcomeFlowComplete() {
  Cookies.set(COMPLETED_WELCOME_FLOW_COOKIE, "true", { expires: 365 });
}

export function _CompletedWelcomeFlowDummyComponent() {
  setWelcomeFlowComplete();
  return null;
}

function UsageTypeSection({
  title,
  description,
  callToAction,
  icon,
  onClick,
}: {
  title: string;
  description: string | JSX.Element;
  callToAction: string;
  icon?: React.ElementType;
  onClick: () => void;
}) {
  return (
    <div>
      <Text className="font-bold">{title}</Text>
      <div className="text-base mt-1 mb-3">{description}</div>
      <div
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        <div className="text-link font-medium cursor-pointer select-none">
          {callToAction}
        </div>
      </div>
    </div>
  );
}

export function _WelcomeModal({ user }: { user: User | null }) {
  const router = useRouter();
  const [selectedFlow, setSelectedFlow] = useState<null | "search" | "chat">(
    null
  );
  const [isHidden, setIsHidden] = useState(false);
  const [apiKeyVerified, setApiKeyVerified] = useState<boolean>(false);
  const [providerOptions, setProviderOptions] = useState<
    WellKnownLLMProviderDescriptor[]
  >([]);

  useEffect(() => {
    async function fetchProviderInfo() {
      const { providers, options, defaultCheckSuccessful } =
        await checkLlmProvider(user);
      setApiKeyVerified(providers.length > 0 && defaultCheckSuccessful);
      setProviderOptions(options);
    }

    fetchProviderInfo();
  }, []);

  if (isHidden) {
    return null;
  }

  let title;
  let body;
  switch (selectedFlow) {
    case "search":
      title = undefined;
      body = (
        <div className="max-h-[85vh] overflow-y-auto px-4 pb-4">
          <BackButton behaviorOverride={() => setSelectedFlow(null)} />
          <div className="mt-3">
            <Text className="font-bold flex">
              {apiKeyVerified && (
                <FiCheckCircle className="my-auto mr-2 text-success" />
              )}
              第1步: 设置LLM
            </Text>
            <div>
              {apiKeyVerified ? (
                <Text className="mt-2">
                  LLM设置完毕!
                  <br /> <br />
                  如果您以后想更改密钥，您可以在管理面板中轻松执行此操作。
                </Text>
              ) : (
                <ApiKeyForm
                  onSuccess={() => setApiKeyVerified(true)}
                  providerOptions={providerOptions}
                />
              )}
            </div>
            <Text className="font-bold mt-6 mb-2">
              第2步: 连接数据源
            </Text>
            <div>
              <Text>
                连接器是毕方从组织的各种数据源获取数据的方式。
                设置完成后，我们会自动将您的应用程序和文档中的数据同步到平台，
                以便您可以在一个地方搜索所有内容。
              </Text>

              <div className="flex mt-3">
                <Link
                  href="/admin/add-connector"
                  onClick={(e) => {
                    e.preventDefault();
                    setWelcomeFlowComplete();
                    router.push("/admin/add-connector");
                  }}
                  className="w-fit mx-auto"
                >
                  <Button size="xs" icon={FiShare2} disabled={!apiKeyVerified}>
                    配置您的第一个连接器!
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
      break;
    case "chat":
      title = undefined;
      body = (
        <div className="mt-3 max-h-[85vh] overflow-y-auto px-4 pb-4">
          <BackButton behaviorOverride={() => setSelectedFlow(null)} />

          <div className="mt-3">
            <Text className="font-bold flex">
              {apiKeyVerified && (
                <FiCheckCircle className="my-auto mr-2 text-success" />
              )}
              第1步: 配置LLM
            </Text>
            <div>
              {apiKeyVerified ? (
                <Text className="mt-2">
                  LLM配置完毕!
                  <br /> <br />
                  如果您以后想更改密钥或选择不同的LLM，
                  您可以在管理面板中轻松执行此操作。
                </Text>
              ) : (
                <div>
                  <ApiKeyForm
                    onSuccess={() => setApiKeyVerified(true)}
                    providerOptions={providerOptions}
                  />
                </div>
              )}
            </div>

            <Text className="font-bold mt-6 mb-2 flex">
              第2步: 开始会话!
            </Text>

            <Text>
              单击下面的按钮开始与配置的LLM进行聊天！
              别担心，如果您以后决定要连接组织的知识，
              您可以在 {" "}
              <Link
                className="text-link"
                href="/admin/add-connector"
                onClick={(e) => {
                  e.preventDefault();
                  setWelcomeFlowComplete();
                  router.push("/admin/add-connector");
                }}
              >
                管理面板中执行此操作
              </Link>
              .
            </Text>

            <div className="flex mt-3">
              <Link
                href="/chat"
                onClick={(e) => {
                  e.preventDefault();
                  setWelcomeFlowComplete();
                  router.push("/chat");
                  setIsHidden(true);
                }}
                className="w-fit mx-auto"
              >
                <Button size="xs" icon={FiShare2} disabled={!apiKeyVerified}>
                  开始会话!
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
      break;
    default:
      title = "🎉 欢迎使用毕方";
      body = (
        <>
          <div>
            <Text>比方能做什么?</Text>
          </div>
          <Divider />
          <UsageTypeSection
            title="Search / Chat with Knowledge"
            description={
              <Text>
                如果您想搜索、聊天或直接询问您组织内部的知识问题，那么毕方就是您的选择!
              </Text>
            }
            callToAction="Get Started"
            onClick={() => setSelectedFlow("search")}
          />
          <Divider />
          <UsageTypeSection
            title="Secure ChatGPT"
            description={
              <Text>
                如果您正在寻找纯粹的类似ChatGPT的体验，那么毕方是您的选择！
              </Text>
            }
            icon={FiMessageSquare}
            callToAction="Get Started"
            onClick={() => {
              setSelectedFlow("chat");
            }}
          />

          {/* TODO: add a Slack option here */}
          {/* <Divider />
          <UsageTypeSection
            title="AI-powered Slack Assistant"
            description="If you're looking to setup a bot to auto-answer questions in Slack"
            callToAction="Connect your company knowledge!"
            link="/admin/add-connector"
          /> */}
        </>
      );
  }

  return (
    <Modal title={title} className="max-w-4xl">
      <div className="text-base">{body}</div>
    </Modal>
  );
}
