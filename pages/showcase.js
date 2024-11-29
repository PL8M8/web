import React, {useState} from "react";
import Navbar from "@components/Navbar";

export default function showcase() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  function toggleSidebar() {
    console.log("Button click");
    // TODO: Log Clicking but not hiding
    setSidebarVisible((prev) => !prev);
  }

  // TODO: move sections into proper places
  return (
    <div className="page">
      <div className="background" />
      <Navbar />
      <div className="showcase">
        <section className={`sidebar ${sidebarVisible ? "" : "hide"}`}>SIDE BAR BLUE
          <button className="sidebar-button" onClick={()=>toggleSidebar()}>☰</button>
        </section>
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