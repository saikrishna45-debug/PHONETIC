from pydantic import BaseModel, ConfigDict, Field


class ResalePredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    launch_price_inr: int = Field(gt=0)
    launch_year: int = Field(ge=0)
    age_years: float = Field(ge=0, allow_inf_nan=False)
    ram_gb: int = Field(gt=0)
    storage_gb: int = Field(gt=0)
    display_hz: int = Field(gt=0)
    battery_health_pct: float = Field(ge=0, le=100, allow_inf_nan=False)
    camera_mp: float = Field(gt=0, allow_inf_nan=False)

    brand: str = Field(min_length=1)
    model: str = Field(min_length=1)
    processor: str = Field(min_length=1)
    condition: str = Field(min_length=1)
    screen_crack: str = Field(min_length=1)
    scratches: str = Field(min_length=1)
    box: str = Field(min_length=1)
    charger: str = Field(min_length=1)
    invoice: str = Field(min_length=1)
    warranty: str = Field(min_length=1)
    network: str = Field(min_length=1)
    repair_history: str = Field(min_length=1)
    seller_type: str = Field(min_length=1)


class ResalePredictionResponse(BaseModel):
    estimated_resale_price_inr: float
    display_price_inr: int
    currency: str
    model_version: str