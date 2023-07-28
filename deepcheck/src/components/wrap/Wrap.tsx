import React, { ReactNode } from "react";
import "./Wrap.scss";

function Wrap({
  children,
  style,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className="outer">
      <div className="inner" style={style}>
        {children}
      </div>
    </div>
  );
}

export default Wrap;
