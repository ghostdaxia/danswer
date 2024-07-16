export function HeaderWrapper({
  children,
}: {
  children: JSX.Element | string;
}) {
  return (
    <header className="border-b border-border bg-background-emphasis header-bc">
      <style jsx global>
        {`
          .header-bc {
            background: #20318f;
          }
          .header-word{
            color: #e5e7eb;
          }
          .hd-hover{
            background: #20318f;
          }
          .hd-hover:hover{
            background: #2031df;
          }
          .i-color{
            color: #ff3120;
          }
        `}
      </style>
      <div className="mx-8 h-16">{children}</div>
    </header>
  );
}
