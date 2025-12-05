"use client"

import { useEffect, useState } from 'react'
import { useProfileStore } from '@/modules/profile'
import { useParams } from 'next/navigation'

export default function ProfilePage() {
    const params = useParams()
    const { profile, user, initialize, loadProfileByUsername, updateProfileTable, uploadVehicleImages, initialized } = useProfileStore()
    
    const [editing, setEditing] = useState(false)
    const [username, setUsername] = useState('')
    const [sellerNotes, setSellerNotes] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        initialize()
    }, [])

    useEffect(() => {
        if (initialized && params.username) {
            loadProfileByUsername(params.username as string)
        }
    }, [params.username, initialized])

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || '')
            setSellerNotes(profile.vehicle?.seller_notes || '')
            setImageFile(null)
            setPreview('')
        }
    }, [profile])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSave = async () => {
        if (!user?.id) return
        
        setSaving(true)
        try {
            let vehicleImage = profile?.vehicle_images?.[0] || null
            
            if (imageFile) {
                const uploaded = await uploadVehicleImages([imageFile])
                vehicleImage = uploaded[0]
            }

            await updateProfileTable(user.id, {
                username,
                vehicle: { seller_notes: sellerNotes },
                vehicle_images: vehicleImage ? [vehicleImage] : []
            })

            await loadProfileByUsername(params.username as string)
            setEditing(false)
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    if (!profile) {
        return <div>Loading...</div>
    }

    const isOwner = user?.id === profile.id
    const vehicleImage = profile.vehicle_images?.[0]

    return (
        <>
            <style jsx>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-page {
                        width: 8.5in;
                        height: 11in;
                        margin: 0;
                        padding: 0.5in;
                        background-color: #FF9C2A;
                        page-break-after: always;
                    }
                    body { margin: 0; }
                }
                .print-page {
                    max-width: 8.5in;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }
                .vehicle-image {
                    width: 100%;
                    height: auto;
                    max-height: 6in;
                    object-fit: contain;
                    margin-bottom: 20px;
                }
                .seller-notes {
                    white-space: pre-wrap;
                    line-height: 1.6;
                    font-size: 14pt;
                }
                .username {
                    font-size: 24pt;
                    font-weight: 900;
                    margin-bottom: 20px;
                    text-align: center;
                    text-transform: uppercase;
                }
                .section-label {
                    font-size: 12pt;
                    font-weight: bold;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                }
            `}</style>

            {isOwner && !editing && (
                <div className="no-print">
                    <button onClick={() => setEditing(true)}>Edit Profile</button>
                    <button onClick={() => window.print()}>Print Listing</button>
                </div>
            )}

            {!isOwner && (
                <div className="no-print">
                    <button onClick={() => window.print()}>Print Listing</button>
                </div>
            )}

            {editing && isOwner ? (
                <div className="no-print">
                    <h2>Edit Profile</h2>
                    
                    <div>
                        <label>Username</label>
                        <input 
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Seller Notes</label>
                        <textarea 
                            value={sellerNotes}
                            onChange={e => setSellerNotes(e.target.value)}
                            rows={8}
                        />
                    </div>

                    <div>
                        <label>Vehicle Image</label>
                        
                        {vehicleImage && !preview && (
                            <div>
                                <p>Current:</p>
                                <img src={vehicleImage} alt="" width="200" />
                            </div>
                        )}

                        <input 
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        
                        {preview && (
                            <div>
                                <p>New:</p>
                                <img src={preview} alt="" width="200" />
                            </div>
                        )}
                    </div>

                    <button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div className="print-page">
                    <div className="username">{profile.username || 'Listing'}</div>
                    
                    {vehicleImage && (
                        <img src={vehicleImage} alt="Vehicle" className="vehicle-image" />
                    )}

                    {profile.vehicle?.seller_notes && (
                        <>
                            <div className="section-label">Details</div>
                            <div className="seller-notes">{profile.vehicle.seller_notes}</div>
                        </>
                    )}

                    {!vehicleImage && !profile.vehicle?.seller_notes && (
                        <p>No listing information available</p>
                    )}
                </div>
            )}
        </>
    )
}