import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login-Logik hier hinzufügen
    alert(`Eingeloggt als: ${email}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-900 text-white">
      <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 text-black w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Passwort:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 text-black w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
