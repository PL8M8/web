import styles from "./VehicleListing.module.css";

export default function VehicleListing({ item, index }) {
  const vehicle = item;
  const placeholderImageSrc = `/blank.jpg`;

  return (
    <div key={index} className="listing-item">
      <img className="listing-image" src={placeholderImageSrc} />
      <div className="listing-details">
        <h3 className="listing-title">
          {vehicle.title || "Title Placeholder"}
        </h3>
        <p className="listing-description">
          {vehicle.description || "Description Placeholder"}
        </p>
        <div className="listing-price">
          {vehicle.price || "Price Placeholder"}
        </div>
      </div>
    </div>
  );
}
