import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import pandas as pd
import logging
from typing import List, Union


# Load model
with open("churn_pipeline.pkl", "rb") as f:
    model = pickle.load(f)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


app = FastAPI()

class CustomerInput(BaseModel):
    gender: str
    SeniorCitizen: int
    Partner: str
    Dependents: str
    tenure: int
    PhoneService: str
    MultipleLines: str
    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str
    Contract: str
    PaperlessBilling: str
    PaymentMethod: str
    MonthlyCharges: float
    TotalCharges: float

@app.post("/predict")
def predict(input_data: Union[CustomerInput, List[CustomerInput]]):
    # Normalize to list
    if isinstance(input_data, CustomerInput):
        input_data = [input_data]

    input_dicts = [record.dict() for record in input_data]
    logger.info(f"Incoming batch request with {len(input_dicts)} records.")

    input_df = pd.DataFrame(input_dicts)
    predictions = model.predict(input_df).tolist()

    logger.info(f"Batch prediction result: {predictions}")
    return {"predictions": predictions}



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)