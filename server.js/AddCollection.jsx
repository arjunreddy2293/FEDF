import React, { useState } from 'react';

function AddCollection() {
    const [location, setLocation] = useState('');
    const [wasteType, setWasteType] = useState('w1');
    const [message, setMessage] = useState('');

    // Mock Waste Types (In a real app, this would be fetched from GET /wastes)
    const mockWasteTypes = [
        { id: 'w1', name: 'Plastic' },
        { id: 'w2', name: 'Organic' },
        { id: 'w3', name: 'Metal' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Submitting...');
        
        const collectionData = {
            location: location,
            typeId: wasteType
            // The backend will automatically set the 'status' to 'Pending'
        };

        try {
            // NOTE: Replace the URL with your actual backend API address
            const response = await fetch('http://localhost:3000/collections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(collectionData),
            });

            if (response.status === 201) {
                setMessage('✅ Collection request submitted successfully!');
                setLocation('');
                setWasteType('w1');
            } else {
                setMessage('❌ Failed to submit request. Check API connection.');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            setMessage('❌ An error occurred. Is your backend server running?');
        }
    };

    return (
        <div className="add-collection-form" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>AddCollection (Report Waste)</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Location/Address:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Waste Type:</label>
                    <select
                        value={wasteType}
                        onChange={(e) => setWasteType(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        {mockWasteTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Submit Collection Request
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
}

export default AddCollection;