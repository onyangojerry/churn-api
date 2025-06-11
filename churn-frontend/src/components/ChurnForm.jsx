import { useState } from "react";
import axios from "axios";

const initialForm = {
  gender: "Female",
  SeniorCitizen: 0,
  Partner: "Yes",
  Dependents: "No",
  tenure: 12,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "Fiber optic",
  OnlineSecurity: "No",
  OnlineBackup: "Yes",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "Yes",
  StreamingMovies: "Yes",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 75.35,
  TotalCharges: 900.20
};

export default function ChurnForm() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "https://churn-api-qlmv.onrender.com/predict", // replace this!
      form
    );
    setResult(response.data.churn_prediction || response.data.predictions?.[0]);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Churn Predictor</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(initialForm).map((key) => (
          <div key={key} className="mb-2">
            <label className="block text-sm mb-1">{key}</label>
            <input
              className="w-full border px-2 py-1 rounded"
              name={key}
              value={form[key]}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
          Predict
        </button>
      </form>
      {result && (
        <div className="mt-4 text-lg">
            Prediction:{" "}
            <strong
            className={
                result === "Yes" ? "text-green-600" : "text-red-600"
            }
            >
            {result}
            </strong>
        </div>
        )}
    </div>
  );
}
