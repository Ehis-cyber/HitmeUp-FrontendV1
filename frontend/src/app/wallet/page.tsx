'use client';
import React, { useState } from 'react';
import { FaWallet, FaPlus, FaArrowDown, FaArrowUp } from 'react-icons/fa';

export default function WalletPage() {
  const [balance, setBalance] = useState(50000); // Simulated wallet balance
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'credit', amount: 10000, date: '2025-04-01', description: 'Gig Payment' },
    { id: 2, type: 'debit', amount: 5000, date: '2025-03-28', description: 'Withdrawal' },
    { id: 3, type: 'credit', amount: 20000, date: '2025-03-20', description: 'Gig Payment' },
  ]); // Simulated transaction history
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showWithdrawFundsModal, setShowWithdrawFundsModal] = useState(false);

  const handleAddFunds = (amount: number) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [
      { id: Date.now(), type: 'credit', amount, date: new Date().toISOString(), description: 'Added Funds' },
      ...prev,
    ]);
    setShowAddFundsModal(false);
  };

  const handleWithdrawFunds = (amount: number) => {
    if (amount > balance) {
      alert('Insufficient balance!');
      return;
    }
    setBalance((prev) => prev - amount);
    setTransactions((prev) => [
      { id: Date.now(), type: 'debit', amount, date: new Date().toISOString(), description: 'Withdrawal' },
      ...prev,
    ]);
    setShowWithdrawFundsModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        {/* Wallet Header */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaWallet className="text-blue-600" /> Wallet
            </h1>
            <p className="text-gray-500 mt-2">Manage your wallet and transactions</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">Current Balance</p>
            <h2 className="text-4xl font-bold text-green-600">₦{balance.toLocaleString()}</h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setShowAddFundsModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <FaPlus className="inline-block mr-2" /> Add Funds
          </button>
          <button
            onClick={() => setShowWithdrawFundsModal(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition"
          >
            <FaArrowDown className="inline-block mr-2" /> Withdraw Funds
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transaction History</h2>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-gray-600 font-medium">Date</th>
                    <th className="p-3 text-gray-600 font-medium">Description</th>
                    <th className="p-3 text-gray-600 font-medium">Type</th>
                    <th className="p-3 text-gray-600 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t">
                      <td className="p-3 text-gray-700">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="p-3 text-gray-700">{transaction.description}</td>
                      <td
                        className={`p-3 font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                      </td>
                      <td className="p-3 text-gray-700">₦{transaction.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No transactions found.</p>
          )}
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Funds</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amount = parseInt((e.target as any).amount.value, 10);
                handleAddFunds(amount);
              }}
            >
              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddFundsModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Funds Modal */}
      {showWithdrawFundsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Withdraw Funds</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amount = parseInt((e.target as any).amount.value, 10);
                handleWithdrawFunds(amount);
              }}
            >
              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawFundsModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}