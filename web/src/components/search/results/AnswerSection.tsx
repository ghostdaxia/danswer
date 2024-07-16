import { Quote } from "@/lib/search/interfaces";
import { ResponseSection, StatusOptions } from "./ResponseSection";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TEMP_STRING = "__$%^TEMP$%^__";

function replaceNewlines(answer: string) {
  // Since the one-shot answer is a JSON, GPT adds extra backslashes to the
  // newlines. This function replaces the extra backslashes with the correct
  // number of backslashes so that ReactMarkdown can render the newlines

  // Step 1: Replace '\\\\n' with a temporary placeholder
  answer = answer.replace(/\\\\n/g, TEMP_STRING);

  // Step 2: Replace '\\n' with '\n'
  answer = answer.replace(/\\n/g, "\n");

  // Step 3: Replace the temporary placeholder with '\\n'
  answer = answer.replace(TEMP_STRING, "\\n");

  return answer;
}

interface AnswerSectionProps {
  answer: string | null;
  quotes: Quote[] | null;
  error: string | null;
  nonAnswerableReason: string | null;
  isFetching: boolean;
}

export const AnswerSection = (props: AnswerSectionProps) => {
  let status = "in-progress" as StatusOptions;
  let header = <>组织语言中...</>;
  let body = null;

  // finished answer
  if (props.quotes !== null || !props.isFetching) {
    status = "success";
    header = <>AI回答</>;
    if (props.answer) {
      body = (
        <ReactMarkdown
          className="prose text-sm max-w-full"
          remarkPlugins={[remarkGfm]}
        >
          {replaceNewlines(props.answer)}
        </ReactMarkdown>
      );
    } else {
      body = <div>未发现任何相关信息</div>;
    }
    // error while building answer (NOTE: if error occurs during quote generation
    // the above if statement will hit and the error will not be displayed)
  } else if (props.error) {
    status = "failed";
    header = <>生成回答时出现问题</>;
    body = (
      <div className="flex">
        <div className="text-error my-auto ml-1">{props.error}</div>
      </div>
    );
    // answer is streaming
  } else if (props.answer) {
    status = "success";
    header = <>AI回答</>;
    body = (
      <ReactMarkdown
        className="prose text-sm max-w-full"
        remarkPlugins={[remarkGfm]}
      >
        {replaceNewlines(props.answer)}
      </ReactMarkdown>
    );
  }
  if (props.nonAnswerableReason) {
    status = "warning";
    header = <>正在努力计算最佳AI回复...</>;
  }

  return (
    <ResponseSection
      status={status}
      header={
        <div className="flex">
          <div className="ml-2 text-strong">{header}</div>
        </div>
      }
      body={
        <div className="">
          {body}
          {props.nonAnswerableReason && !props.isFetching && (
            <div className="mt-4 text-sm">
              <b className="font-medium">警告:</b> AI认为这个问题还无法回答.{" "}
              <div className="italic mt-1 ml-2">
                {props.nonAnswerableReason}
              </div>
            </div>
          )}
        </div>
      }
      desiredOpenStatus={true}
      isNotControllable={true}
    />
  );
};
