import { useParams, useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    const verifiyToken = async () => {
      // const backendUrl = process.env.REACT_APP_BACKEND_URL;

      try {
        const response = await fetch(
          `http://localhost:9001/user/verify_email`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        if (response.ok) {
          setVerified(true);
          navigate("/profile");
        } else {
          console.error("Server returned an error:", response.statusText);
        }
      } catch (error) {
        console.error("error sending token to server:", error);
      }
    };

    if (token) {
      verifiyToken();
    }
  }, [token, navigate]);

  return <>{verified ? <h1 className="text-2xl text-center mt-10">email verified !</h1> : <></>}</>;
}

export default VerifyEmail;
