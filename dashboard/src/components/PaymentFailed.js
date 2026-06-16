
import { Link } from "react-router-dom";

export default function PaymentFailed() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>❌ Payment Failed</h1>

      <p>
        Your payment could not be completed. Please try again.
      </p>

      <Link to="/">Go to Home</Link>
    </div>
  );
}