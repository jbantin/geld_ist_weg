// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import ProfileOverview from "../components/profile/ProfileOverview";
import ProfilePersonal from "../components/profile/ProfilePersonal";
import ProfileSecurity from "../components/profile/ProfileSecurity";
import ProfileNotifications from "../components/profile/ProfileNotifications";
import ProfileConnected from "../components/profile/ProfileConnected";
import ProfilePrivacy from "../components/profile/ProfilePrivacy";
import { Loader } from "../components/ui/Loading_spinner";
import Button from "../components/ui/Button"; // neu

const Profile = () => {
  // const navigate = useNavigate();
  // const { isLoggedIn } = useContext(DefaultContext);
  
  // useEffect(() => {
  //   const hasToken = document.cookie.split(";").some(cookie => cookie.trim().startsWith("jwt="));
  //   if (!hasToken || !isLoggedIn) {
  //     navigate("/login");
  //   }
  // }, [navigate, isLoggedIn]);

  // Zustand für den aktuell ausgewählten Tab
  const [activeTab, setActiveTab] = useState<"overview" | "personal" | "security" | "notifications" | "connected" | "privacy">("overview");
  
  // Neuer loading State
  const [loading, setLoading] = useState(true);

  // Neuer State für das Burgermenü
  const [menuOpen, setMenuOpen] = useState(false);

  // Neuer State für aktuelle Preise
  const [currentPrices, setCurrentPrices] = useState<{ [key: string]: number }>({});
  const [currentChanges, setCurrentChanges] = useState<{ [key: string]: string }>({}); // neu

  useEffect(() => {
    // Simuliere einen asynchronen Ladevorgang
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Coins der Portfolioübersicht: Mapping Label -> Binance Symbol
    const coinsMapping: { [key: string]: string } = {
      "Bitcoin (BTC)": "BTCUSDT",
      "Ethereum (ETH)": "ETHUSDT",
      "Binance Coin (BNB)": "BNBUSDT",
      "Solana (SOL)": "SOLUSDT",
    };

    const fetchPrices = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/price");
        if (!res.ok) throw new Error("Preisabfrage fehlgeschlagen");
        const data = await res.json();
        const prices: { [key: string]: number } = {};
        for (const [label, symbol] of Object.entries(coinsMapping)) {
          const coinData = data.find((d: any) => d.symbol === symbol);
          if (coinData) {
            prices[label] = parseFloat(coinData.price);
          }
        }
        setCurrentPrices(prices);
      } catch (error) {
        console.error("Fehler beim Abrufen der aktuellen Preise:", error);
      }
    };

    const fetchChanges = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
        if (!res.ok) throw new Error("Änderungsabfrage fehlgeschlagen");
        const data = await res.json();
        const changes: { [key: string]: string } = {};
        for (const [label, symbol] of Object.entries(coinsMapping)) {
          const coinData = data.find((d: any) => d.symbol === symbol);
          if (coinData) {
            changes[label] = `${parseFloat(coinData.priceChangePercent).toFixed(2)}%`;
          }
        }
        setCurrentChanges(changes);
      } catch (error) {
        console.error("Fehler beim Abrufen der aktuellen Änderungen:", error);
      }
    };

    fetchPrices();
    fetchChanges();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfileOverview currentPrices={currentPrices} currentChanges={currentChanges} />; // übergeben
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
        return <ProfileOverview currentPrices={currentPrices} currentChanges={currentChanges} />;
    }
  };

  // Loader anzeigen, falls noch loading true ist
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-swich">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-swich">
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Mein Profil</h2>
        {/* Burger-Button: Nur auf mobilen Geräten sichtbar */}
        <div className="md:hidden mb-4">
          <Button onClick={() => setMenuOpen(!menuOpen)} className="py-2 px-4 btn-bg">
            ☰
          </Button>
        </div>
        <div className={`flex ${menuOpen ? "flex flex-col" : ""}`}>
           {/* Navigation */}
          <nav className={`mb-4 ${menuOpen ? "flex flex-col" : "hidden"} md:block md:w-1/5`}>
            <Button onClick={() => { setActiveTab("overview"); setMenuOpen(false); }} className="py-2 px-4 btn-bg m-2 md:text-lg text-xs w-50">
              Übersicht
            </Button>
            <Button onClick={() => { setActiveTab("personal"); setMenuOpen(false); }} className="py-2 px-4 btn-bg m-2 md:text-lg text-xs w-50">
              Persönliche Daten
            </Button>
            <Button onClick={() => { setActiveTab("security"); setMenuOpen(false); }} className="py-2 px-4 btn-bg m-2 md:text-lg text-xs w-50">
              Sicherheit
            </Button>
            <Button onClick={() => { setActiveTab("notifications"); setMenuOpen(false); }} className="py-2 px-4 btn-bg m-2 md:text-lg text-xs w-50">
              Benachrichtigungen
            </Button>
            <Button onClick={() => { setActiveTab("connected"); setMenuOpen(false); }} className="py-2 px-4 btn-bg m-2 md:text-lg text-xs w-50">
              Verknüpfte Konten
            </Button>
            <Button onClick={() => { setActiveTab("privacy"); setMenuOpen(false); }} className="py-2 px-4 btn-bg m-2 md:text-lg text-xs w-50">
              Datenschutz
            </Button>
          </nav>

          {/* Inhalt des aktuell ausgewählten Tabs */}
          <section className="flex-1 mt-2 btn-bg p-6 rounded">
            {renderContent()}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
