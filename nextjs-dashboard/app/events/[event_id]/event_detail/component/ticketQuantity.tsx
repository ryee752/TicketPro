"use client";

import { useState } from "react";

export default function TicketQuantity() {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex items-center justify-center space-x-2 bg-blue-500 rounded-lg overflow-hidden w-28">
        {/* Minus Button */}
        <button
          onClick={handleDecrease}
          className="bg-blue-700 text-white px-2 py-1 text-sm focus:outline-none"
          disabled={quantity <= 1}
        >
          -
        </button>

        {/* Quantity Display */}
        <div className="bg-white text-center text-sm font-medium text-gray-800 w-8 py-1">
          {quantity}
        </div>

        {/* Plus Button */}
        <button
          onClick={handleIncrease}
          className="bg-blue-900 text-white px-2 py-1 text-sm focus:outline-none"
        >
          +
        </button>
      </div>
    </div>
  );
}