
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import GeneralContext from "./GeneralContext";
import { useAuth } from "../components/AuthContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0);

  const navigate = useNavigate();

  const { checkout } = useAuth();

  const handleBuyClick = async () => {
    try {
      await checkout({
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        model: "BUY",
    
      });

      GeneralContext.closeBuyWindow();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelClick = () => {
    GeneralContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              value={stockQuantity}
              onChange={(e) =>
                setStockQuantity(e.target.value)
              }
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>

            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0"
              value={stockPrice}
              onChange={(e) =>
                setStockPrice(e.target.value)
              }
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>
          Margin required ₹
          {(stockQuantity * stockPrice).toFixed(2)}
        </span>

        <div>
          <Link
            className="btn btn-blue"
            onClick={handleBuyClick}
          >
            Buy
          </Link>

          <Link
            to=""
            className="btn btn-grey"
            onClick={handleCancelClick}
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
