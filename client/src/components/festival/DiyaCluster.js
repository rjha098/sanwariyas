// FILE: client/src/components/festival/DiyaCluster.js
"use client";

import DiyaLamp from "./DiyaLamp";

/* back -> front, like the reference: 2 small far, 2 medium, 1 big centre */
export default function DiyaCluster() {
  return (
    <div className="dw-cluster">
      <DiyaLamp flowers={false} className="dw-cd dw-cd--fl" />
      <DiyaLamp flowers={false} className="dw-cd dw-cd--fr" />
      <DiyaLamp flowers={false} className="dw-cd dw-cd--l" />
      <DiyaLamp flowers={false} className="dw-cd dw-cd--r" />
      <DiyaLamp flowers={false} className="dw-cd dw-cd--c" />
    </div>
  );
}
