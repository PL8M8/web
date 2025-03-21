import React, { useState } from "react";
import VehicleListing from "@components/VehicleListing";

export default function showcase() {
  const listingsToDisplayPerRow = 3;

  const [sidebarVisible, setSidebarVisible] = useState(false);
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
      title: "Hyundai",
      description: "A slick 2024 Hyundai",
      price: "50k",
    },
    {
      title: "Kia Sorrento",
      description: "A white 2020 Kia Sorrento",
      price: "100k",
    },
    {
      title: "Toyota Camry",
      description: "2019 Toyota Camry",
      price: "30k",
    },
    {
      title: "Model T",
      description: "An original Model T Ford",
      price: "500k",
    },
    {
      title: "Tesla",
      description: "The sleek electric Telsa",
      price: "200k",
    },
  ];

  return (
    <div className="page">
      <div className="background" />
      <div className="showcase">
        <section className={`sidebar${sidebarVisible ? "" : "-hide"}`}>
          Side Bar Place Holder
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
          <section className="content-header">
            Content Header Placeholder (Only Visible on Desktop){" "}
          </section>
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
