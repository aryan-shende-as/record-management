import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { variables } from "../../Variables"; // Assuming you store your base API URL here

function Location() {
  const [departmentsWithLocation, setDepartmentsWithLocation] = useState([]);
  const [locationData, setLocationData] = useState(" ");
  const [error, setError] = useState(null);

  // Fetch departments from your API and filter only those with non-empty location
  useEffect(() => {
    fetch(`${variables.API_URL}department`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(dep => dep.Location && dep.Location.trim() !== "");
        setDepartmentsWithLocation(filtered);
        if (filtered.length > 0) {
         fetch(`http://localhost:5099/api/map/location/${filtered[0].DepartmentId}`)
         .then(async res => {
           if (!res.ok) {
             const err = await res.text();
             throw new Error(err);
           }
           return res.json();
         })
         .then(data => {
           setLocationData(data);
         })
         .catch(err => {
           console.error('Failed to fetch location data:', err.message);
           setError(err.message);
         });
        }
      })
      .catch(err => {
        console.error("Error fetching departments:", err);
        setError("Unable to load departments.");
      });
  }, []);

  const handleLocationChange = (e) => {
    const selectedId = e.target.value;
    fetch(`http://localhost:5099/api/map/location/${selectedId}`)
      .then(async res => {
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err);
        }
        return res.json();
      })
      .then(data => {
        setLocationData(data);
      })
      .catch(err => {
        console.error('Failed to fetch location data:', err.message);
        setError(err.message);
      });
  }

  return (
    <div className="p-6 text-center">
      <h4 className="text-3xl font-bold mb-4">Department Location</h4>

      {departmentsWithLocation.length > 0 ? (
        <select
          className="p-2 border rounded mb-4"
          value={locationData ? locationData.DepartmentId : ""}
          onChange = {(e)=>handleLocationChange(e)}
        >
          {departmentsWithLocation.map((dep) => (
            <option key={dep.DepartmentId} value={dep.DepartmentId}>
              {dep.DepartmentName}
            </option>
          ))}
        </select>
      ) : (
        <p>No departments with valid locations found.</p>
      )}

      {error && <p className="text-red-600">Error: {error}</p>}

      {locationData && !isNaN(locationData.lat) && !isNaN(locationData.lon) ? (
        <MapContainer
          key={`${locationData.lat}-${locationData.lon}`}
          center={[parseFloat(locationData.lat), parseFloat(locationData.lon)]}
          zoom={13}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[parseFloat(locationData.lat), parseFloat(locationData.lon)]}>
            <Popup>
              <strong>{locationData.departmentName}</strong><br />
              {locationData.location}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        !error && locationData && <p>Loading map...</p>
      )}
    </div>
  );
}

export default Location;
