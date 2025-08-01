import React, { useState } from "react";
import axios from "axios";
const PaymentPage = () => {
  const [value, setValue] = useState(0);
  const PayNow = async () => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/api/v1/payments/create-order",
        {
          value,
        }
      );

      window.location.href = response.data.checkOutPageUrl;

      console.log(response.data.checkOutPageUrl);
    } catch (err) {
      console.log("Error in PayNow", err);
    }
  };

  return (
    <>
      <p className="text-3xl font-bold">Phonepe API v2 integration</p>
      <input
        type="number"
        placeholder="Enter amount...."
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />

      <button onClick={PayNow} className="bg-red-500 p-2 text-wgite">
        Pay Now
      </button>
    </>
  );
};

export default PaymentPage;
