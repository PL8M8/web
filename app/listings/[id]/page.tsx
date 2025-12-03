import { createClient } from "@/utils/supabase/server";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: currentCar, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", Number(id))
        .single();

    if (error) {
        return <div>Error loading car: {error.message}</div>;
    }

    if (!currentCar) {
        return <div>Car not found</div>;
    }

    return (
        <div>
        <h1>Car Details</h1>
        <div>Id: {currentCar.id}</div>
        <div>Created At: {currentCar.created_at}</div>
        <div>VIN: {currentCar.vin}</div>
        <div>Year: {currentCar.year}</div>
        <div>Make: {currentCar.make}</div>
        <div>Model: {currentCar.model}</div>
        <div>Color: {currentCar.color}</div>
        <div>Condition: {currentCar.condition}</div>
        <div>Tag Number: {currentCar.tag_number}</div>
        <div>Sellable: {currentCar.is_sellable ? "Yes" : "No"}</div>
        <div>Rentable: {currentCar.is_rentable ? "Yes" : "No"}</div>
        <div>Mileage: {currentCar.mileage}</div>
        <div>
            Image: <br />
            <img src={currentCar.image_uri} alt={`${currentCar.make} ${currentCar.model}`} width={300} />
        </div>
        <div>Nickname: {currentCar.nickname || "N/A"}</div>
        <div>Listing Price: ${currentCar.listing_price}</div>
        <div>Archived: {currentCar.is_archived ? "Yes" : "No"}</div>
        </div>
    );
}
