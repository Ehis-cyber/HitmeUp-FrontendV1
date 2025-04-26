"use client";

import React, { useState, useEffect } from "react";
import { FaWallet, FaPlus, FaMinus, FaHistory } from "react-icons/fa";
import { Modal, Input, Button } from "@nextui-org/react";

export default function Wallet() {
  const [balance, setBalance] = useState(500);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState("Deposit");
  const [amount, setAmount] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTransactions([
      { id: 1, type: "Deposit", amount: 200, date: "2025-01-10" },
      { id: 2, type: "Withdraw", amount: 100, date: "2025-01-11" },
    ]);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleTransaction = () => {
    if (amount && parseFloat(amount) > 0) {
      const newTransaction = {
        id: transactions.length + 1,
        type: transactionType,
        amount: parseFloat(amount),
        date: new Date().toISOString().split("T")[0],
      };
      setTransactions([newTransaction, ...transactions]);

      if (transactionType === "Deposit") {
        setBalance(balance + parseFloat(amount));
      } else {
        setBalance(balance - parseFloat(amount));
      }

      setAmount("");
      setShowModal(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-950 flex items-center">
            <FaWallet className="mr-2" /> Wallet
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setTransactionType("Deposit");
                setShowModal(true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <FaPlus className="inline mr-1" /> Deposit
            </button>
            <button
              onClick={() => {
                setTransactionType("Withdraw");
                setShowModal(true);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <FaMinus className="inline mr-1" /> Withdraw
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl">Current Balance</h3>
          <p className="text-3xl font-bold text-green-600">${balance.toFixed(2)}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaHistory className="mr-2" /> Transaction History
          </h3>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between p-3 bg-gray-100 rounded-md shadow-sm"
                >
                  <div>
                    <p className="font-medium">{tx.type}</p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
                  </div>
                  <p
                    className={`text-lg ${
                      tx.type === "Deposit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "Deposit" ? "+" : "-"}${tx.amount.toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No transactions yet.</p>
            )}
          </div>
        </div>
      </div>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        <Modal.Header>
          <h2 className="text-lg font-bold">{transactionType}</h2>
        </Modal.Header>
        <Modal.Body>
          <Input
            type="number"
            placeholder="Enter amount"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button auto onClick={handleTransaction}>
            {transactionType}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
