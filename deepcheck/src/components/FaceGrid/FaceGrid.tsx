import React, { ReactNode } from "react";
import "./FaceGrid.scss";

function FaceGrid({ faces }: { faces: string[] }) {
  return (
    <div className="grid">
      {faces.map((face) => {
        return <img src={face} alt="face" className="face" />;
      })}
    </div>
  );
}

export default FaceGrid;
