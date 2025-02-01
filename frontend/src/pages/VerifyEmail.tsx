import { useParams } from "react-router-dom";
// import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
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
  }, []);

  return <>{verified ? <h1>email verified !</h1> : <></>}</>;
}

export default VerifyEmail;
