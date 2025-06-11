import { useState } from "react";
import axios from "axios";
import Papa from "papaparse";

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
  const [csvPredictions, setCsvPredictions] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/predict`,
      form
    );
    setResult(response.data.churn_prediction || response.data.predictions?.[0]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const data = results.data;
          const response = await axios.post(
            "https://churn-api-qlmv.onrender.com/predict",
            data
          );
          setCsvPredictions(response.data.predictions);
        } catch (err) {
          console.error("CSV prediction error:", err);
        }
      }
    });
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
          <strong className={result === "Yes" ? "text-green-600" : "text-red-600"}>
            {result}
          </strong>
        </div>
      )}

      <hr className="my-6" />

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Upload CSV for Batch Prediction</h3>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4"
        />

        {csvPredictions.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium">Results:</h4>
            <ul className="list-disc ml-6">
              {csvPredictions.map((pred, i) => (
                <li key={i} className={pred === "Yes" ? "text-green-600" : "text-red-600"}>
                  Row {i + 1}: {pred}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
