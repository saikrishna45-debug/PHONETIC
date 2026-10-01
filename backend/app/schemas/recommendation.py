from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

UsageProfile = Literal[
    "gaming",
    "photography",
    "study",
    "work",
    "social",
    "entertainment",
    "general",
]
PriorityFactor = Literal[
    "performance",
    "battery",
    "ram",
    "storage",
    "display",
    "price",
    "rating",
    "refresh_rate",
    "camera",
]
PriorityWeight = Annotated[int, Field(ge=0, le=5)]


class RecommendationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    budget_min: int | None = Field(default=None, ge=0)
    budget_max: int | None = Field(default=None, ge=0)
    usage: list[UsageProfile] = Field(default_factory=lambda: ["general"])
    min_ram_gb: int | None = Field(default=None, gt=0)
    min_storage_gb: int | None = Field(default=None, gt=0)
    requires_5g: bool = False
    min_battery_mah: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    preferred_display_min: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    preferred_display_max: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    priorities: dict[PriorityFactor, PriorityWeight] | None = None

    @model_validator(mode="after")
    def validate_ranges(self) -> "RecommendationRequest":
        if (
            self.budget_min is not None
            and self.budget_max is not None
            and self.budget_min > self.budget_max
        ):
            raise ValueError("budget_min must not exceed budget_max")
        if (
            self.preferred_display_min is not None
            and self.preferred_display_max is not None
            and self.preferred_display_min > self.preferred_display_max
        ):
            raise ValueError("preferred_display_min must not exceed preferred_display_max")
        return self


class RecommendationSpecifications(BaseModel):
    ram_gb: int | float | None
    storage_gb: int | float | None
    battery_mah: int | float | None
    processor_speed_ghz: int | float | None
    display_size_inches: int | float | None
    refresh_rate_hz: int | float | None
    has_5g: bool | None


class RecommendationItem(BaseModel):
    mobile_name: str
    brand: str
    price: float
    ratings: float
    match_score: float
    specifications: RecommendationSpecifications
    why_it_matches: list[str]
    tradeoffs: list[str]
    image_url: str | None


class RecommendationResponse(BaseModel):
    recommendations: list[RecommendationItem]