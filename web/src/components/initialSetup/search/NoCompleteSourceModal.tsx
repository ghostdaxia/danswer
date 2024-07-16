"use client";

import { Modal } from "../../Modal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CCPairBasicInfo } from "@/lib/types";
import { useRouter } from "next/navigation";

export function NoCompleteSourcesModal({
  ccPairs,
}: {
  ccPairs: CCPairBasicInfo[];
}) {
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isHidden) {
    return null;
  }

  const totalDocs = ccPairs.reduce(
    (acc, ccPair) => acc + ccPair.docs_indexed,
    0
  );

  return (
    <Modal
      className="max-w-4xl"
      title="⏳ 您的连接器尚未完成完全同步"
      onOutsideClick={() => setIsHidden(true)}
    >
      <div className="text-sm">
        <div>
          <div>
            您已连接一些源，但都没有完成同步。根据已连接到平台知识库的大小，初始同步可能需要 30 秒到几天的时间才能完成。
            到目前为止，我们已经同步了{" "}
            <b>{totalDocs}</b> 篇文档.
            <br />
            <br />
            要查看同步连接器的状态，请转到{" "}
            <Link className="text-link" href="admin/indexing/status">
              现有连接器页面
            </Link>
            .
            <br />
            <br />
            <p
              className="text-link cursor-pointer inline"
              onClick={() => {
                setIsHidden(true);
              }}
            >
              或者，单击此处继续并就已同步的知识集提出问题。
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
