// src/pages/Profile.tsx
import { useState } from "react";
import ProfileOverview from "../components/profile/ProfileOverview";
import ProfilePersonal from "../components/profile/ProfilePersonal";
import ProfileSecurity from "../components/profile/ProfileSecurity";
import ProfileNotifications from "../components/profile/ProfileNotifications";
import ProfileConnected from "../components/profile/ProfileConnected";
import ProfilePrivacy from "../components/profile/ProfilePrivacy";

const Profile = () => {
  // Zustand, um den aktuell ausgewählten Tab zu verwalten
  const [activeTab, setActiveTab] = useState<
  
    | "overview"
    | "personal"
    | "security"
    | "notifications"
    | "connected"
    | "privacy"
  >("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfileOverview />;
      case "personal":
        return <ProfilePersonal />;
      case "security":
        return <ProfileSecurity />;
      case "notifications":
        return <ProfileNotifications />;
      case "connected":
        return <ProfileConnected />;
      case "privacy":
        return <ProfilePrivacy />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-swich">
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">Mein Profil</h2>
        <div className="flex flex-col md:flex-row">
          {/* Navigation (z.B. Sidebar oder Tabs) */}
          <nav className="flex md:flex-col mb-4 md:mb-0 md:w-1/4">
            <button
              onClick={() => setActiveTab("overview")}
              className="py-2 px-4 hover:bg-gray-700"
            >
              Übersicht
            </button>
            <button
              onClick={() => setActiveTab("personal")}
              className="py-2 px-4 hover:bg-gray-700"
            >
              Persönliche Daten
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className="py-2 px-4 hover:bg-gray-700"
            >
              Sicherheit
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className="py-2 px-4 hover:bg-gray-700"
            >
              Benachrichtigungen
            </button>
            <button
              onClick={() => setActiveTab("connected")}
              className="py-2 px-4 hover:bg-gray-700"
            >
              Verknüpfte Konten
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className="py-2 px-4 hover:bg-gray-700"
            >
              Datenschutz
            </button>
          </nav>

          {/* Inhalt des aktuell ausgewählten Tabs */}
          <section className="flex-1 bg-gray-800 p-6 rounded">
            {renderContent()}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
