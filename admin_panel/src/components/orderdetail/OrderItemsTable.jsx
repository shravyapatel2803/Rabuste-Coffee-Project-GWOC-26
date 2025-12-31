import React from "react";

const OrderItemsTable = ({ items }) => {
  return (
    <div className="bg-white">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
          <tr>
            <th className="p-3">Item</th>
            <th className="p-3">Price</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {items?.map((item, index) => (
            <tr key={item.itemId || index}>
              <td className="p-3">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">
                     {item.nameSnapshot.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{item.nameSnapshot}</div>
                  </div>
                </div>
              </td>
              <td className="p-3 font-medium text-gray-800">₹ {item.priceSnapshot}</td>
              <td className="p-3">
                <span className="px-2 py-0.5 font-bold text-gray-700 text-xs border rounded bg-gray-50">
                  x {item.quantity}
                </span>
              </td>
              <td className="p-3 font-bold text-gray-800">
                ₹ {item.priceSnapshot * item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderItemsTable;