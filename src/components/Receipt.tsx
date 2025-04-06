import React from 'react';
import { FaUtensils } from 'react-icons/fa';

interface OrderItem {
  menuItem: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface ReceiptProps {
  order: {
    _id: string;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
    cashAmount?: number;
    changeAmount?: number;
    createdAt: string;
  };
}

const Receipt: React.FC<ReceiptProps> = ({ order }) => {
  return (
    <div className="p-8 max-w-md mx-auto bg-white">
      <div className="text-center mb-6">
        <img
          src="/images/kahwa-kabab-logo.png"
          alt="Kahwa & Kabab Logo"
          className="h-16 w-auto mx-auto mb-2"
        />
        <h1 className="text-2xl font-bold">Kahwa & Kabab</h1>
        <p className="text-gray-600">123 Restaurant Street</p>
        <p className="text-gray-600">Phone: (123) 456-7890</p>
      </div>

      <div className="border-t border-b border-gray-300 py-4 my-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Order #:</span>
          <span>{order._id.slice(-6)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">Date:</span>
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">Payment Method:</span>
          <span>{order.paymentMethod}</span>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Items:</h2>
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between mb-1">
            <span>
              {item.quantity}x {item.menuItem.name}
            </span>
            <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-300 pt-4">
        <div className="flex justify-between font-semibold mb-2">
          <span>Subtotal:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
        {order.paymentMethod === 'CASH' && (
          <>
            <div className="flex justify-between mb-2">
              <span>Cash Received:</span>
              <span>${order.cashAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Change:</span>
              <span>${order.changeAmount?.toFixed(2)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-600">Thank you for your order!</p>
        <p className="text-sm text-gray-600">Please come again</p>
      </div>
    </div>
  );
};

export default Receipt; 