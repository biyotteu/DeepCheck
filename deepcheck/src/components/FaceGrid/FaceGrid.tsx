import React from "react";
import "./FaceGrid.scss";

function FaceGrid({ faces }: { faces: string[] }) {
  return (
    <div className="face-grid">
      {faces.map((face) => {
        return <img src={face} alt="face" className="face-item" />;
      })}
    </div>
  );
}

export default FaceGrid;
