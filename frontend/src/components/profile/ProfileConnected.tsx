// src/components/profile/ProfileConnected.tsx
import React, { useState } from "react";

type ConnectedAccount = {
  id: number;
  provider: string;
  connected: boolean;
};

const ProfileConnected: React.FC = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    { id: 1, provider: "Google", connected: true },
    { id: 2, provider: "Facebook", connected: false },
    { id: 3, provider: "Twitter", connected: true },
  ]);

  const toggleConnection = (id: number) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id
          ? { ...account, connected: !account.connected }
          : account
      )
    );
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Verknüpfte Konten</h3>
      <ul>
        {accounts.map((account) => (
          <li
            key={account.id}
            className="mb-4 flex items-center"
          >
            <span className="w-20">{account.provider}</span>
            <button
              onClick={() => toggleConnection(account.id)}
              className={`px-4 py-2 rounded text-white w-30 ${
                account.connected ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {account.connected ? "Trennen" : "Verbinden"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileConnected;
