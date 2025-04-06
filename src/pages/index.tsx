import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { FaBox, FaReceipt, FaChartBar, FaCog } from 'react-icons/fa';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

interface Order {
  _id: string;
  items: {
    menuItem: MenuItem;
    quantity: number;
  }[];
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export default function ManagerDashboard() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuResponse, ordersResponse] = await Promise.all([
        axios.get('https://kahwa-kabab-server-e85fa91cb51b.herokuapp.com/api/menu'),
        axios.get('https://kahwa-kabab-server-e85fa91cb51b.herokuapp.com/api/orders')
      ]);
      setMenuItems(menuResponse.data);
      setOrders(ordersResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const updateStock = async (itemId: string, newStock: number) => {
    try {
      await axios.put(`https://kahwa-kabab-server-e85fa91cb51b.herokuapp.com/api/menu/${itemId}`, {
        stock: newStock
      });
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, stock: newStock } : item
        )
      );
    } catch (err) {
      setError('Failed to update stock');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`https://kahwa-kabab-server-e85fa91cb51b.herokuapp.com/api/orders/${orderId}`, {
        status: newStatus
      });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Kahwa & Kabab - Manager Dashboard</title>
        <meta name="description" content="Manager dashboard for Kahwa & Kabab" />
      </Head>

      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/images/kahwa-kabab-logo.png"
              alt="Kahwa & Kabab Logo"
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inventory Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FaBox className="text-2xl text-orange-500" />
                <h2 className="text-xl font-semibold">Inventory</h2>
              </div>
              <div className="space-y-4">
                {menuItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Current stock: {item.stock}</p>
                    </div>
                    <input
                      type="number"
                      value={item.stock}
                      onChange={(e) => updateStock(item._id, parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FaReceipt className="text-2xl text-orange-500" />
                <h2 className="text-xl font-semibold">Recent Orders</h2>
              </div>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Order #{order._id.slice(-6)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm">
                          {item.quantity}x {item.menuItem.name}
                        </p>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Total: ${order.total}</p>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 