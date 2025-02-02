import { useState } from "react";
import { motion } from "framer-motion";

const Register = () => {
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isAdult = (dateStr: string) => {
    const today = new Date();
    const dob = new Date(dateStr);
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    return age > 18 || (age === 18 && m >= 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !birthDate || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (!isAdult(birthDate)) {
      alert("You must be at least 18 years old");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Registration logic here
    alert(`Registered successfully as: ${username}`);
  };

  return (
    <motion.div className="flex justify-center items-center h-screen bg-dark">
      <form className="w-fit flex flex-col items-center gap-6 p-10 rounded-2xl bg-[var(--bg-lightdark)]  min-w-150" onSubmit={handleSubmit}>
        {/* Logo */}
        <div className="w-30 h-30 rounded-lg shadow-2xl overflow-hidden">
          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="Logo" className="w-full h-full object-cover p-4" />
        </div>
        {/* Titelbereich */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl font-bold text-[var(--text-color)]">Register Your Account</p>
          <span className="text-xs text-swich text-center max-w-xs">
            Create your account and start trading.
          </span>
        </div>
        {/* Username Input */}
        <div className="relative w-full">
          <label htmlFor="username_field" className="block text-xs text-swich font-semibold mb-1">Username</label>
          <input
            type="text"
            id="username_field"
            placeholder="Enter username"
            className="pl-3 pr-4 py-2 w-full rounded-md border bg-gray-100"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
     
        {/* Email Input */}
        <div className="relative w-full">
          <label htmlFor="email_field" className="block text-xs text-swich font-semibold mb-1">Email</label>
          <input
            type="email"
            id="email_field"
            placeholder="name@mail.com"
            className="pl-3 pr-4 py-2 w-full rounded-md border bg-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* Date of Birth Input */}
        <div className="relative w-full">
          <label htmlFor="birthDate_field" className="block text-xs text-swich font-semibold mb-1">Date of Birth</label>
          <input
            type="date"
            id="birthDate_field"
            className="pl-3 pr-4 py-2 w-full rounded-md border bg-gray-100"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        {/* Password Input */}
        <div className="relative w-full">
          <label htmlFor="password_field" className="block text-xs text-swich font-semibold mb-1">Password</label>
          <input
            type="password"
            id="password_field"
            placeholder="Enter password"
            className="pl-3 pr-4 py-2 w-full rounded-md border bg-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Confirm Password Input */}
        <div className="relative w-full">
          <label htmlFor="confirmPassword_field" className="block text-xs text-swich font-semibold mb-1">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword_field"
            placeholder="Confirm password"
            className="pl-3 pr-4 py-2 w-full rounded-md border bg-gray-100"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {/* Submit Button */}
        <button type="submit" className="w-full py-2 rounded-md bg-green-600 text-swich font-bold hover:bg-green-700 transition-colors">
          <span>Register</span>
        </button>
      </form>
    </motion.div>
  );
};

export default Register;
