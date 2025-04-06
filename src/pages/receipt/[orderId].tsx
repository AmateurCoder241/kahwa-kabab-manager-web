import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { FaPrint } from 'react-icons/fa';

// Dynamically import the Receipt component with no SSR
const Receipt = dynamic(() => import('../../components/Receipt'), {
  ssr: false
});

export default function ReceiptPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        `https://kahwa-kabab-server-e85fa91cb51b.herokuapp.com/api/orders/${orderId}`
      );
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load order');
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  if (!order) {
    return <div className="text-center p-8">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Receipt</h1>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FaPrint />
            <span>Print Receipt</span>
          </button>
        </div>
        <Receipt order={order} />
      </div>
    </div>
  );
} 