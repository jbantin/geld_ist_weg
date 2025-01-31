import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwörter stimmen nicht überein");
      return;
    }
    // Registrierungs-Logik hier hinzufügen
    alert(`Registriert als: ${email}`);
  };

  return (
    <div className="flex justify-center items-center bg-dark text-light">
      <form onSubmit={handleSubmit} className="bg-dark p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 text-dark w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Passwort:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 text-dark w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Passwort bestätigen:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 text-dark w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-light font-bold py-2 px-4 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
