import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function App() {
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  });

  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState("expense"); // ✅ IMPORTANT FIX
  const [monthFilter, setMonthFilter] = useState("All");
  const [editId, setEditId] = useState(null);

  // SAVE to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // ADD / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !amount) return;

    const data = {
      id: editId || Date.now(),
      text,
      amount: parseFloat(amount),
      category,
      type, // income or expense
      date: new Date().toISOString(),
    };

    if (editId) {
      setTransactions(transactions.map((t) => (t.id === editId ? data : t)));
      setEditId(null);
    } else {
      setTransactions([data, ...transactions]);
    }

    setText("");
    setAmount("");
    setCategory("Food");
    setType("expense");
  };

  // DELETE
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // EDIT
  const editTransaction = (t) => {
    setText(t.text);
    setAmount(t.amount);
    setCategory(t.category);
    setType(t.type);
    setEditId(t.id);
  };

  // FILTER
  const filtered =
    monthFilter === "All"
      ? transactions
      : transactions.filter(
          (t) => new Date(t.date).getMonth() === Number(monthFilter)
        );

  // 📊 INCOME / EXPENSE (FIXED LOGIC)
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  // PIE CHART DATA
  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-purple-100 to-pink-100 p-6">

      <h1 className="text-4xl font-bold text-center mb-6">
         Expense Tracker Dashboard
      </h1>

      {/* FILTER */}
      <div className="flex justify-center mb-4">
        <select
          className="p-2 border rounded"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="All">All Months</option>
          <option value="0">Jan</option>
          <option value="1">Feb</option>
          <option value="2">Mar</option>
          <option value="3">Apr</option>
          <option value="4">May</option>
          <option value="5">Jun</option>
          <option value="6">Jul</option>
          <option value="7">Aug</option>
          <option value="8">Sep</option>
          <option value="9">Oct</option>
          <option value="10">Nov</option>
          <option value="11">Dec</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2>Balance</h2>
          <p className="text-xl font-bold text-blue-600">₹{balance}</p>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <h2>Income</h2>
          <p className="text-green-600 font-bold">₹{income}</p>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <h2>Expense</h2>
          <p className="text-red-600 font-bold">₹{expense}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        {/* PIE CHART */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-center font-bold mb-3">Income vs Expense</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-center font-bold mb-3">Trend</h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="text" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">

        <input
          className="w-full p-2 border mb-2"
          placeholder="Description"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-2 border mb-2"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* TYPE SELECT (IMPORTANT FIX) */}
        <select
          className="w-full p-2 border mb-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <select
          className="w-full p-2 border mb-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Salary</option>
          <option>Others</option>
        </select>

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          {editId ? "Update Transaction" : "Add Transaction"}
        </button>
      </form>

      {/* LIST */}
      {filtered.map((t) => (
        <div key={t.id} className="bg-white p-3 mb-2 rounded shadow flex justify-between">

          <div>
            <h3 className="font-bold">{t.text}</h3>
            <p className="text-sm text-gray-500">{t.category}</p>
          </div>

          <div className="flex gap-3 items-center">

            <span className={t.type === "income" ? "text-green-600" : "text-red-600"}>
              ₹{t.amount}
            </span>

            <button onClick={() => editTransaction(t)} className="text-blue-500">
              Edit
            </button>

            <button onClick={() => deleteTransaction(t.id)} className="text-red-500">
              Delete
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}

export default App;