import styles from "./VehicleListing.module.css";

export default function VehicleListing(props) {
  const vehicle = props.item;
  const placeholderImageSrc = `/TestCar${props.index + 1}.jpg`;

  return (
    <div key={props.index} className="listing-item">
      <img className="listing-image" src={placeholderImageSrc} />
      <div className="listing-details">
        <h3 className="listing-title">
          {vehicle.title || "Title Placeholder"}
        </h3>
        <p className="listing-description">
          {vehicle.description || "Description Placeholder"}
        </p>
        <div className="listing-price">{vehicle.price || "$0k"}</div>
      </div>
    </div>
  );
}
