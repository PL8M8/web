import React, { useState } from "react";
import Navbar from "@components/Navbar";
import VehicleListing from "@components/VehicleListing";

export default function showcase() {
  const listingsToDisplayPerRow = 3;

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [visibleListings, setVisibleListings] = useState(
    listingsToDisplayPerRow
  );

  function toggleSidebar() {
    setSidebarVisible(!sidebarVisible);
  }

  function loadMoreListings() {
    setVisibleListings((prev) => prev + listingsToDisplayPerRow);
  }

  const listings = [
    {
      title: "TEST CAR 1",
      description: "THIS IS THE FIRST TEST LISTING",
      price: "50k",
    },
    {
      title: "Fast Car",
      description: "Vroom Vroom",
      price: "100k",
    },
    {
      title: "Toyota Camry",
      description: "It's a pretty normal car",
      price: "30k",
    },
    {
      title: "Used Car",
      description: "Found it in the bottom of the lake",
      price: "0k",
    },
    {
      title: "Cool Car",
      description: "Hot Rod Red ",
      price: "200k",
    },
  ];

  return (
    <div className="page">
      <div className="background" />
      <Navbar />
      <div className="showcase">
        <section className={`sidebar${sidebarVisible ? "" : "-hide"}`}>
          SIDE BAR BLUE
        </section>
        <button
          className="sidebar-button"
          onClick={toggleSidebar}
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
          <section className="listings">
            {listings.slice(0, visibleListings).map((item, index) => (
              <VehicleListing key={index} item={item} index={index} />
            ))}
            {visibleListings < listings.length && (
              <button onClick={loadMoreListings} className="load-more" />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

// .listing area sub header on desktop
// mobile
