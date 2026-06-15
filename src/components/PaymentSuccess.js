// PaymentSuccess.jsx
import { useSearchParams, Link } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>✅ Payment Successful</h1>

      <p>Thank you for your purchase.</p>

      {reference && (
        <p>
          <strong>Payment ID:</strong> {reference}
        </p>
      )}

      <Link to="/">Go to Home</Link>
    </div>
  );
}