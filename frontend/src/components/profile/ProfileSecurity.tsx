// src/components/profile/ProfileSecurity.tsx
import React, { useState } from "react";

const ProfileSecurity: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Neue Passwörter stimmen nicht überein!");
      return;
    }
    // Hier Logik zum Aendern des Passworts einfuegen
    console.log("Passwort ändern:", currentPassword, newPassword);
    alert("Passwort erfolgreich geändert!");
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Sicherheitseinstellungen</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Aktuelles Passwort</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Neues Passwort</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Neues Passwort bestätigen</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Passwort ändern
        </button>
      </form>
    </div>
  );
};

export default ProfileSecurity;
