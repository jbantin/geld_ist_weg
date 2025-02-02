import { useState } from "react";
import { motion } from "framer-motion";
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic here
    alert(`Logged in as: ${email}`);
  };

  return (
    <motion.div className="flex justify-center items-center h-screen bg-dark">
      <form className="w-fit flex flex-col items-center gap-6 p-10 rounded-2xl bg-[var(--bg-lightdark)]" onSubmit={handleSubmit}>
        {/* Logo */}
        <div className="w-20 h-20 rounded-lg shadow-md overflow-hidden">
          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="Logo" className="w-full h-full object-cover p-4" />
        </div>
        {/* Titelbereich */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl font-bold text-[var(--text-color)]">Login to your Account</p>
          <span className="text-xs text-[var(--text-color)] text-center max-w-xs">
            Get started with our app, just create an account and enjoy the experience.
          </span>
        </div>
        {/* Email Input */}
        <div className="relative w-full">
          <label htmlFor="email_field" className="block text-xs text-swich font-semibold mb-1">Email</label>
          <svg className="w-5 h-5 absolute left-3 bottom-2 text-swich" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#141B34" d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#141B34" d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" />
          </svg>
          <input
            type="text"
            id="email_field"
            placeholder="name@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 pr-4 py-2 w-full rounded-md border bg-gray-100" 
          />
        </div>
        {/* Password Input */}
        <div className="relative w-full">
          <label htmlFor="password_field" className="block text-xs text-swich font-semibold mb-1">Password</label>
          <svg className="w-5 h-5 absolute left-3 bottom-2 text-swich" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth="1.5" stroke="#141B34" d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#141B34" d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9" />
          </svg>
          <input
            type="password"
            id="password_field"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 pr-4 py-2 w-full rounded-md border bg-gray-100"
          />
        </div>
        {/* Buttons */}
        <button type="submit" className="w-full py-2 rounded-md bg-green-600 text-swich font-bold hover:bg-green-700 transition-colors">
          Sign In
        </button>
        <div className="w-full flex items-center justify-center gap-4">
          <hr className="w-full border-gray-200" />
          <span className="text-xs text-swich">Or</span>
          <hr className="w-full border-gray-200" />
        </div>
        <button type="button" className="w-full py-2 rounded-md bg-white flex items-center justify-center gap-2 border border-gray-300 hover:shadow-md transition-shadow">
          <svg className="w-5 h-5" viewBox="0 0 32 32" xmlnsXlink="http://www.w3.org/2000/xlink" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" id="A" />
            </defs>
            <clipPath id="B">
              <use xlinkHref="#A" />
            </clipPath>
            <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
              <path fill="#fbbc05" clipPath="url(#B)" d="M0 37V11l17 13z" />
              <path fill="#ea4335" clipPath="url(#B)" d="M0 11l17 13 7-6.1L48 14V0H0z" />
              <path fill="#34a853" clipPath="url(#B)" d="M0 37l30-23 7.9 1L48 0v48H0z" />
              <path fill="#4285f4" clipPath="url(#B)" d="M48 48L17 24l-4-3 35-10z" />
            </g>
          </svg>
          <span className="text-gray-800 font-bold text-sm">Sign In with Google</span>
        </button>
        <button type="button" className="w-full py-2 rounded-md bg-gray-800 flex items-center justify-center gap-2 border border-gray-300 hover:shadow-md transition-shadow">
          <svg className="w-4 h-4" preserveAspectRatio="xMidYMid" viewBox="0 0 256 315" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path fill="#ffffff" d="M213.803394,167.030943 C214.2452,214.609646 255.542482,230.442639 256,230.644727 C255.650812,231.761357 249.401383,253.208293 234.24263,275.361446 C221.138555,294.513969 207.538253,313.596333 186.113759,313.991545 C165.062051,314.379442 158.292752,301.507828 134.22469,301.507828 C110.163898,301.507828 102.642899,313.596301 82.7151126,314.379442 C62.0350407,315.16201 46.2873831,293.668525 33.0744079,274.586162 C6.07529317,235.552544 -14.5576169,164.286328 13.147166,116.18047 C26.9103111,92.2909053 51.5060917,77.1630356 78.2026125,76.7751096 C98.5099145,76.3877456 117.677594,90.4371851 130.091705,90.4371851 C142.497945,90.4371851 165.790755,73.5415029 190.277627,76.0228474 C200.528668,76.4495055 229.303509,80.1636878 247.780625,107.209389 C246.291825,108.132333 213.44635,127.253405 213.803394,167.030988" />
            </g>
          </svg>
          <span className="text-light font-bold text-sm">Sign In with Apple</span>
        </button>
        <div className="w-full flex items-center justify-center gap-4">
          <hr className="w-full border-gray-200" />
          <span className="text-xs text-swich">Or</span>
          <hr className="w-full border-gray-200" />
        </div>
        <button type="button" className="w-full py-2 rounded-md bg-green-600 text-swich font-bold hover:bg-green-700 transition-colors">
          <span>Register</span>
        </button>
        <p className="text-xs text-swich underline">Terms of use &amp; Conditions</p>
      </form>
    </motion.div>
  );
};

export default Login;
