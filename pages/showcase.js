import React, { useState, useEffect } from "react";
import Navbar from "@components/Navbar";

export default function showcase() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    console.log("sidebarVisible is changing");
  }, [sidebarVisible]);

  function toggleSidebar() {
    console.log("toggle sidebar ");

    setSidebarVisible(!sidebarVisible);
  }

  // TODO: move sections into proper places
  return (
    <div className="page">
      <div className="background" />
      <Navbar />
      <div className="showcase">
        <section className={`sidebar${sidebarVisible ? "" : "-hide"}`}>
          SIDE BAR BLUE
        </section>
        {/* <section className="sidebar">SIDE BAR BLUE</section> */}
        <button
          className="sidebar-button"
          onClick={() => toggleSidebar()}
          style={{
            position: "absolute",
            left: sidebarVisible ? "250px" : "10px",
            transition: "left 0.3s ease",
          }}
        >
          ☰
        </button>
        <main className="main-content">
          <section className="content-header">CONTENT HEADER RED</section>
          <section className="listings">LISTINGS GREEN</section>
        </main>
      </div>
    </div>
  );
}

// add placeholders into .listings section
// .listing area sub header on desktop
// mobile
