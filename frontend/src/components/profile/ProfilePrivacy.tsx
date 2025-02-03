// src/components/profile/ProfilePrivacy.tsx
import React, { useState } from "react";

const ProfilePrivacy: React.FC = () => {
  const [dataSharing, setDataSharing] = useState(false);
  const [tracking, setTracking] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Hier Datenschutzeinstellungen speichern
    console.log("Datenschutzeinstellungen:", dataSharing, tracking);
    alert("Datenschutzeinstellungen gespeichert!");
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Datenschutzeinstellungen</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={dataSharing}
              onChange={(e) => setDataSharing(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2">Datenfreigabe erlauben</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={tracking}
              onChange={(e) => setTracking(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2">Tracking erlauben</span>
          </label>
        </div>
        <button
          type="submit"
          className="bg-accent text-white px-4 py-2 rounded"
        >
          Einstellungen speichern
        </button>
      </form>
    </div>
  );
};

export default ProfilePrivacy;
