"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProfileStore } from "@/modules/profile";
import { supabase } from "@/utils/supabase/client";

interface Profile {
  id: string;
  username: string;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = typeof params.username === "string" ? params.username : undefined;

  const loadCurrentUser = useProfileStore((state) => state.loadCurrentUser);
  const loadProfileByUsername = useProfileStore((state) => state.loadProfileByUsername);
  const updateProfileTable = useProfileStore((state) => state.updateProfileTable);
  const profile = useProfileStore((state) => state.profile);
  const user = useProfileStore((state) => state.user);
  const loading = useProfileStore((state) => state.loading);
  const error = useProfileStore((state) => state.error);

  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [vin, setVin] = useState("");
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [condition, setCondition] = useState("");
  const [mileage, setMileage] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [vehicleDescription, setVehicleDescription] = useState("");
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // Load current user on mount
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  // Load profile when username changes
  useEffect(() => {
    if (username) {
      loadProfileByUsername(username);
    }
  }, [username, loadProfileByUsername]);

  // Update form fields when profile loads
  useEffect(() => {
    if (profile) {
      setNewUsername(profile.username ?? "");
      setVin(profile.vehicle?.vin ?? "");
      setYear(profile.vehicle?.year?.toString() ?? "");
      setMake(profile.vehicle?.make ?? "");
      setModel(profile.vehicle?.model ?? "");
      setColor(profile.vehicle?.color ?? "");
      setCondition(profile.vehicle?.condition ?? "");
      setMileage(profile.vehicle?.mileage?.toString() ?? "");
      setListingPrice(profile.vehicle?.listing_price?.toString() ?? "");
      setImageUri(profile.vehicle?.image_uri ?? "");
      setVehicleDescription(profile.vehicle?.description ?? "");
    }
  }, [profile]);

  // Load available profiles if current profile not found
  useEffect(() => {
    async function loadAvailableProfiles() {
      if (!loading && !profile && error) {
        setLoadingProfiles(true);
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, username")
            .order("username", { ascending: true });

          if (error) throw error;
          setAvailableProfiles(data || []);
        } catch (err) {
          console.error("Failed to load profiles:", err);
        } finally {
          setLoadingProfiles(false);
        }
      }
    }

    loadAvailableProfiles();
  }, [loading, profile, error]);

  const handleSave = useCallback(async () => {
    if (!profile?.id) return;

    const vehicle = {
      vin,
      year: year ? parseInt(year) : 0,
      make,
      model,
      color: color || undefined,
      condition: condition || undefined,
      mileage: mileage ? parseInt(mileage) : undefined,
      listing_price: listingPrice ? parseFloat(listingPrice) : undefined,
      image_uri: imageUri || undefined,
      description: vehicleDescription || undefined,
    };

    try {
      const updatedProfile = await updateProfileTable(profile.id, {
        username: newUsername,
        vehicle,
      });
      
      setEditing(false);
      
      // If username changed, redirect to new URL
      if (updatedProfile.username !== username) {
        router.push(`/${updatedProfile.username}`);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  }, [profile, newUsername, vin, year, make, model, color, condition, mileage, listingPrice, imageUri, vehicleDescription, updateProfileTable, username, router]);

  if (!username) return <div>Invalid profile username</div>;
  if (loading) return <div>Loading profile...</div>;
  
  if (!profile) {
    return (
      <div>
        <h1>Profile Not Found</h1>
        <p>The profile "/{username}" doesn't exist.</p>

        {loadingProfiles ? (
          <p>Loading available profiles...</p>
        ) : availableProfiles.length === 0 ? (
          <p>No profiles found.</p>
        ) : (
          <div>
            <h2>Available Profiles ({availableProfiles.length})</h2>
            <ul>
              {availableProfiles.map((p) => (
                <li key={p.id}>
                  <Link href={`/${p.username}`}>/{p.username}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href="/">Go back home</Link>
      </div>
    );
  }

  const isOwner = user?.id === profile.id;

  return (
    <div>
      <h1>Profile: {profile.username || "Unnamed User"}</h1>
      {isOwner && !editing && (
        <button onClick={() => setEditing(true)}>Edit Profile</button>
      )}

      {!isOwner && user && (
        <p>You can only edit your own profile</p>
      )}

      {editing ? (
        <div>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>

          <h3>Vehicle Information</h3>

          <div>
            <label>VIN:</label>
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
            />
          </div>

          <div>
            <label>Year:</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div>
            <label>Make:</label>
            <input
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </div>

          <div>
            <label>Model:</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div>
            <label>Color:</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div>
            <label>Condition:</label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            />
          </div>

          <div>
            <label>Mileage:</label>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>

          <div>
            <label>Listing Price:</label>
            <input
              type="number"
              step="0.01"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
            />
          </div>

          <div>
            <label>Image URL:</label>
            <input
              type="text"
              value={imageUri}
              onChange={(e) => setImageUri(e.target.value)}
            />
          </div>

          <div>
            <label>Description:</label>
            <textarea
              value={vehicleDescription}
              onChange={(e) => setVehicleDescription(e.target.value)}
            />
          </div>

          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>Username:</strong> {profile.username}</p>
          
          <h3>Vehicle Information</h3>
          <p><strong>VIN:</strong> {profile.vehicle?.vin || "N/A"}</p>
          <p><strong>Year:</strong> {profile.vehicle?.year || "N/A"}</p>
          <p><strong>Make:</strong> {profile.vehicle?.make || "N/A"}</p>
          <p><strong>Model:</strong> {profile.vehicle?.model || "N/A"}</p>
          <p><strong>Color:</strong> {profile.vehicle?.color || "N/A"}</p>
          <p><strong>Condition:</strong> {profile.vehicle?.condition || "N/A"}</p>
          <p><strong>Mileage:</strong> {profile.vehicle?.mileage || "N/A"}</p>
          <p><strong>Listing Price:</strong> {profile.vehicle?.listing_price ? `$${profile.vehicle.listing_price}` : "N/A"}</p>
          {profile.vehicle?.image_uri && (
            <div>
              <strong>Vehicle Image:</strong>
              <br />
              <img src={profile.vehicle.image_uri} alt="Vehicle" width="300" />
            </div>
          )}
          <p><strong>Description:</strong> {profile.vehicle?.description || "N/A"}</p>
        </div>
      )}
    </div>
  );
}