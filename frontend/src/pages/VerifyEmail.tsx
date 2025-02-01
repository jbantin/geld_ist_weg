import { useParams } from "react-router-dom";

function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  console.log(token);
  return (
    <>
      <p>{token}</p>
    </>
  );
}
export default VerifyEmail;
