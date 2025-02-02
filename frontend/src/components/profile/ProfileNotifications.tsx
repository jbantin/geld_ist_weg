// src/components/profile/ProfileNotifications.tsx
import React, { useState } from "react";

const ProfileNotifications: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Hier Einstellungen speichern
    console.log(
      "Benachrichtigungseinstellungen:",
      emailNotifications,
      pushNotifications
    );
    alert("Benachrichtigungseinstellungen gespeichert!");
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">
        Benachrichtigungseinstellungen
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2">E-Mail Benachrichtigungen</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={(e) => setPushNotifications(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2">Push Benachrichtigungen</span>
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Einstellungen speichern
        </button>
      </form>
    </div>
  );
};

export default ProfileNotifications;
