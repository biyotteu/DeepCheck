import React, { ReactNode } from "react";
import "./Wrap.scss";

function Wrap({
  children,
  style,
  outerStyle,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  outerStyle?: React.CSSProperties;
}) {
  return (
    <div className="outer" style={outerStyle}>
      <div className="inner" style={style}>
        {children}
      </div>
    </div>
  );
}

export default Wrap;
