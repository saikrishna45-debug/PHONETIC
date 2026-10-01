from pathlib import Path

import pandas as pd
import numpy as np


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "recommendation_features_clean.csv"
)


# ============================================================
# LOAD DATASET
# ============================================================

def load_recommendation_data():
    """
    Load the cleaned smartphone recommendation dataset.
    """

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Recommendation dataset not found at:\n{DATA_PATH}"
        )

    return pd.read_csv(DATA_PATH)


# ============================================================
# USAGE PROFILES
# ============================================================

USAGE_PROFILES = {

    "gaming": {
        "performance": 1.00,
        "battery": 0.85,
        "ram": 0.90,
        "storage": 0.70,
        "display": 0.75,
        "refresh_rate": 0.90,
        "price": 0.60,
        "rating": 0.50,
    },

    "photography": {
        "performance": 0.55,
        "battery": 0.65,
        "ram": 0.60,
        "storage": 0.70,
        "display": 0.75,
        "refresh_rate": 0.30,
        "price": 0.60,
        "rating": 0.80,
    },

    "study": {
        "performance": 0.50,
        "battery": 0.80,
        "ram": 0.55,
        "storage": 0.65,
        "display": 0.75,
        "refresh_rate": 0.30,
        "price": 0.95,
        "rating": 0.65,
    },

    "work": {
        "performance": 0.85,
        "battery": 0.80,
        "ram": 0.85,
        "storage": 0.80,
        "display": 0.70,
        "refresh_rate": 0.25,
        "price": 0.85,
        "rating": 0.70,
    },

    "social": {
        "performance": 0.45,
        "battery": 0.75,
        "ram": 0.55,
        "storage": 0.60,
        "display": 0.75,
        "refresh_rate": 0.55,
        "price": 0.85,
        "rating": 0.75,
    },

    "entertainment": {
        "performance": 0.65,
        "battery": 0.80,
        "ram": 0.60,
        "storage": 0.75,
        "display": 0.95,
        "refresh_rate": 0.85,
        "price": 0.65,
        "rating": 0.75,
    },

    "general": {
        "performance": 0.60,
        "battery": 0.75,
        "ram": 0.60,
        "storage": 0.65,
        "display": 0.65,
        "refresh_rate": 0.40,
        "price": 0.90,
        "rating": 0.75,
    },
}


# ============================================================
# DEFAULT PRIORITY WEIGHTS
# ============================================================

DEFAULT_PRIORITIES = {
    "performance": 5,
    "battery": 4,
    "ram": 4,
    "storage": 3,
    "display": 2,
    "price": 5,
    "rating": 2,
    "refresh_rate": 3,
    "camera": 0,
}


# ============================================================
# COMBINE MULTIPLE USAGE PROFILES
# ============================================================

def build_usage_profile(usages):
    """
    Combine multiple usage profiles into one profile.
    """

    if isinstance(usages, str):
        usages = [usages]

    valid_usages = [
        usage.lower()
        for usage in usages
        if usage.lower() in USAGE_PROFILES
    ]

    if not valid_usages:
        valid_usages = ["general"]

    combined = {}

    for feature in USAGE_PROFILES["general"]:

        values = [
            USAGE_PROFILES[usage][feature]
            for usage in valid_usages
        ]

        combined[feature] = sum(values) / len(values)

    return combined


# ============================================================
# HARD FILTERING
# ============================================================

def filter_candidates(
    df,
    budget_min=None,
    budget_max=None,
    min_ram_gb=None,
    min_storage_gb=None,
    requires_5g=False,
    min_battery_mah=None,
):
    """
    Apply mandatory user requirements.

    Missing values do not satisfy explicit requirements.
    """

    candidates = df.copy()

    print("\n" + "=" * 60)
    print("HARD FILTERING")
    print("=" * 60)

    print(f"Initial phones: {len(candidates)}")

    # --------------------------------------------------------
    # BUDGET
    # --------------------------------------------------------

    if budget_min is not None:

        candidates = candidates[
            candidates["price"].notna()
            & (candidates["price"] >= budget_min)
        ]

        print(
            f"After minimum budget ₹{budget_min:,}: "
            f"{len(candidates)}"
        )

    if budget_max is not None:

        candidates = candidates[
            candidates["price"].notna()
            & (candidates["price"] <= budget_max)
        ]

        print(
            f"After maximum budget ₹{budget_max:,}: "
            f"{len(candidates)}"
        )

    # --------------------------------------------------------
    # RAM
    # --------------------------------------------------------

    if min_ram_gb is not None:

        candidates = candidates[
            candidates["ram_gb"].notna()
            & (candidates["ram_gb"] >= min_ram_gb)
        ]

        print(
            f"After RAM >= {min_ram_gb} GB: "
            f"{len(candidates)}"
        )

    # --------------------------------------------------------
    # STORAGE
    # --------------------------------------------------------

    if min_storage_gb is not None:

        candidates = candidates[
            candidates["storage_gb"].notna()
            & (candidates["storage_gb"] >= min_storage_gb)
        ]

        print(
            f"After storage >= {min_storage_gb} GB: "
            f"{len(candidates)}"
        )

    # --------------------------------------------------------
    # 5G
    # --------------------------------------------------------

    if requires_5g:

        candidates = candidates[
            candidates["has_5g"].notna()
            & (candidates["has_5g"] == True)
        ]

        print(
            f"After 5G requirement: "
            f"{len(candidates)}"
        )

    # --------------------------------------------------------
    # BATTERY
    # --------------------------------------------------------

    if min_battery_mah is not None:

        candidates = candidates[
            candidates["battery_mah"].notna()
            & (candidates["battery_mah"] >= min_battery_mah)
        ]

        print(
            f"After battery >= {min_battery_mah} mAh: "
            f"{len(candidates)}"
        )

    print("=" * 60)

    return candidates.reset_index(drop=True)


# ============================================================
# MIN-MAX NORMALIZATION
# ============================================================

def min_max_score(series):
    """
    Normalize a series to 0-1.
    Missing values remain NaN.
    """

    minimum = series.min()
    maximum = series.max()

    if pd.isna(minimum) or pd.isna(maximum):
        return pd.Series(
            np.nan,
            index=series.index,
        )

    if maximum == minimum:
        return pd.Series(
            1.0,
            index=series.index,
        )

    return (
        (series - minimum)
        / (maximum - minimum)
    )


# ============================================================
# RAM SCORE
# ============================================================

def calculate_ram_score(ram):

    if pd.isna(ram):
        return np.nan

    if ram >= 16:
        return 1.00

    if ram >= 12:
        return 0.90

    if ram >= 8:
        return 0.80

    if ram >= 6:
        return 0.65

    if ram >= 4:
        return 0.50

    return 0.30


# ============================================================
# STORAGE SCORE
# ============================================================

def calculate_storage_score(storage):

    if pd.isna(storage):
        return np.nan

    if storage >= 512:
        return 1.00

    if storage >= 256:
        return 0.90

    if storage >= 128:
        return 0.75

    if storage >= 64:
        return 0.50

    return 0.25


# ============================================================
# BATTERY SCORE
# ============================================================

def calculate_battery_score(
    battery,
    minimum_battery=None,
):

    if pd.isna(battery):
        return np.nan

    if minimum_battery is not None:

        if battery < minimum_battery:
            return 0.0

        ratio = battery / minimum_battery

        if ratio >= 1.22:
            return 1.00

        if ratio >= 1.11:
            return 0.90

        return 0.80

    if battery >= 5500:
        return 1.00

    if battery >= 5000:
        return 0.90

    if battery >= 4500:
        return 0.80

    if battery >= 4000:
        return 0.65

    return 0.50


# ============================================================
# DISPLAY SCORE
# ============================================================

def calculate_display_score(
    display_size,
    preferred_min=None,
    preferred_max=None,
):

    if pd.isna(display_size):
        return np.nan

    if (
        preferred_min is not None
        and preferred_max is not None
    ):

        if preferred_min <= display_size <= preferred_max:
            return 1.00

        if display_size < preferred_min:
            distance = preferred_min - display_size
        else:
            distance = display_size - preferred_max

        if distance <= 0.2:
            return 0.90

        if distance <= 0.5:
            return 0.75

        if distance <= 0.8:
            return 0.60

        return 0.40

    if display_size >= 6.7:
        return 1.00

    if display_size >= 6.4:
        return 0.90

    if display_size >= 6.1:
        return 0.80

    if display_size >= 5.8:
        return 0.70

    return 0.60


# ============================================================
# REFRESH RATE SCORE
# ============================================================

def calculate_refresh_rate_score(refresh_rate):

    if pd.isna(refresh_rate):
        return np.nan

    if refresh_rate >= 144:
        return 1.00

    if refresh_rate >= 120:
        return 0.90

    if refresh_rate >= 90:
        return 0.75

    if refresh_rate >= 60:
        return 0.60

    return 0.40


# ============================================================
# PRICE SCORE
# ============================================================

def calculate_price_score(
    price,
    budget_min=None,
    budget_max=None,
):

    if pd.isna(price):
        return np.nan

    if (
        budget_min is None
        or budget_max is None
        or budget_max <= budget_min
    ):
        return np.nan

    if price < budget_min or price > budget_max:
        return 0.0

    score = (
        (budget_max - price)
        / (budget_max - budget_min)
    )

    return float(
        np.clip(score, 0.0, 1.0)
    )


# ============================================================
# FEATURE SCORES
# ============================================================

def calculate_feature_scores(
    candidates,
    budget_min=None,
    budget_max=None,
    min_battery_mah=None,
    preferred_display_min=None,
    preferred_display_max=None,
):

    scored = candidates.copy()

    # Performance
    scored["performance_score"] = min_max_score(
        scored["processor_speed_ghz"]
    )

    # Battery
    scored["battery_score"] = scored[
        "battery_mah"
    ].apply(
        lambda value: calculate_battery_score(
            value,
            min_battery_mah,
        )
    )

    # RAM
    scored["ram_score"] = scored[
        "ram_gb"
    ].apply(
        calculate_ram_score
    )

    # Storage
    scored["storage_score"] = scored[
        "storage_gb"
    ].apply(
        calculate_storage_score
    )

    # Display
    scored["display_score"] = scored[
        "display_size_inches"
    ].apply(
        lambda value: calculate_display_score(
            value,
            preferred_display_min,
            preferred_display_max,
        )
    )

    # Refresh rate
    scored["refresh_rate_score"] = scored[
        "refresh_rate_hz"
    ].apply(
        calculate_refresh_rate_score
    )

    # Price
    scored["price_score"] = scored[
        "price"
    ].apply(
        lambda value: calculate_price_score(
            value,
            budget_min,
            budget_max,
        )
    )

    # Rating
    scored["rating_score"] = min_max_score(
        scored["ratings"]
    )

    return scored


# ============================================================
# SCORE COLUMN MAPPING
# ============================================================

SCORE_COLUMNS = {
    "performance": "performance_score",
    "battery": "battery_score",
    "ram": "ram_score",
    "storage": "storage_score",
    "display": "display_score",
    "refresh_rate": "refresh_rate_score",
    "price": "price_score",
    "rating": "rating_score",
}


# ============================================================
# MATCH SCORE
# ============================================================

def calculate_match_score(
    row,
    weights,
):

    weighted_sum = 0.0
    available_weight = 0.0

    for feature, column in SCORE_COLUMNS.items():

        value = row[column]
        weight = weights.get(feature, 0)

        if weight <= 0:
            continue

        if pd.isna(value):
            continue

        weighted_sum += value * weight
        available_weight += weight

    if available_weight == 0:
        return np.nan

    return (
        weighted_sum
        / available_weight
        * 100
    )


# ============================================================
# RANK CANDIDATES
# ============================================================

def rank_candidates(
    candidates,
    priorities=None,
    usage_profile=None,
):

    ranked = candidates.copy()

    if priorities is None:
        priorities = DEFAULT_PRIORITIES.copy()

    if usage_profile is None:
        usage_profile = build_usage_profile(
            ["general"]
        )

    final_weights = {}

    for feature in SCORE_COLUMNS:

        priority = priorities.get(
            feature,
            0,
        )

        usage_weight = usage_profile.get(
            feature,
            1.0,
        )

        final_weights[feature] = (
            priority * usage_weight
        )

    ranked["match_score"] = ranked.apply(
        lambda row: calculate_match_score(
            row,
            final_weights,
        ),
        axis=1,
    )

    ranked = ranked.sort_values(
        by="match_score",
        ascending=False,
        na_position="last",
    )

    return ranked.reset_index(drop=True)


# ============================================================
# DEDUPLICATE PHONE MODELS
# ============================================================

def deduplicate_phone_models(ranked):

    """
    Remove duplicate phone models.

    The highest-ranked listing is kept.
    """

    deduplicated = ranked.drop_duplicates(
        subset=[
            "mobile_name",
            "brand",
        ],
        keep="first",
    )

    return deduplicated.reset_index(
        drop=True
    )


# ============================================================
# FORMAT VALUE HELPERS
# ============================================================

def format_number(value):

    if pd.isna(value):
        return None

    if float(value).is_integer():
        return int(value)

    return round(float(value), 2)


# ============================================================
# GENERATE EXPLANATIONS
# ============================================================

def generate_explanation(
    row,
    preferences,
):

    reasons = []
    tradeoffs = []

    # --------------------------------------------------------
    # RAM
    # --------------------------------------------------------

    ram = row["ram_gb"]
    min_ram = preferences.get(
        "min_ram_gb"
    )

    if pd.notna(ram):

        if min_ram is not None:

            if ram > min_ram:
                reasons.append(
                    f"{format_number(ram)} GB RAM exceeds "
                    f"your {format_number(min_ram)} GB requirement"
                )

            elif ram == min_ram:
                reasons.append(
                    f"{format_number(ram)} GB RAM meets "
                    f"your requirement"
                )

        elif ram >= 12:

            reasons.append(
                f"{format_number(ram)} GB RAM supports "
                "performance-focused usage"
            )

    else:

        tradeoffs.append(
            "RAM information is unavailable"
        )

    # --------------------------------------------------------
    # STORAGE
    # --------------------------------------------------------

    storage = row["storage_gb"]
    min_storage = preferences.get(
        "min_storage_gb"
    )

    if pd.notna(storage):

        if min_storage is not None:

            if storage > min_storage:
                reasons.append(
                    f"{format_number(storage)} GB storage exceeds "
                    f"your {format_number(min_storage)} GB requirement"
                )

            elif storage == min_storage:
                reasons.append(
                    f"{format_number(storage)} GB storage meets "
                    "your requirement"
                )

    else:

        tradeoffs.append(
            "Storage information is unavailable"
        )

    # --------------------------------------------------------
    # 5G
    # --------------------------------------------------------

    has_5g = row["has_5g"]

    if preferences.get("requires_5g"):

        if has_5g is True:
            reasons.append(
                "5G support matches your requirement"
            )
        else:
            tradeoffs.append(
                "5G information is unavailable"
            )

    # --------------------------------------------------------
    # BATTERY
    # --------------------------------------------------------

    battery = row["battery_mah"]
    min_battery = preferences.get(
        "min_battery_mah"
    )

    if pd.notna(battery):

        if (
            min_battery is not None
            and battery >= min_battery
        ):

            reasons.append(
                f"{format_number(battery)} mAh battery "
                f"meets your {format_number(min_battery)} mAh preference"
            )

    else:

        tradeoffs.append(
            "Battery information is unavailable"
        )

    # --------------------------------------------------------
    # DISPLAY
    # --------------------------------------------------------

    display = row["display_size_inches"]

    display_min = preferences.get(
        "preferred_display_min"
    )

    display_max = preferences.get(
        "preferred_display_max"
    )

    if pd.notna(display):

        if (
            display_min is not None
            and display_max is not None
        ):

            if display_min <= display <= display_max:

                reasons.append(
                    f"{format_number(display)}\" display fits "
                    f"your {format_number(display_min)}\"–"
                    f"{format_number(display_max)}\" preference"
                )

            else:

                tradeoffs.append(
                    f"{format_number(display)}\" display is "
                    "outside your preferred range"
                )

    else:

        tradeoffs.append(
            "Display-size information is unavailable"
        )

    # --------------------------------------------------------
    # PROCESSOR
    # --------------------------------------------------------

    processor_speed = row[
        "processor_speed_ghz"
    ]

    if pd.notna(processor_speed):

        reasons.append(
            f"{format_number(processor_speed):.2f} GHz "
            "processor-speed signal supports your "
            "performance-focused usage"
        )

    else:

        tradeoffs.append(
            "Processor-speed information is unavailable"
        )

    # --------------------------------------------------------
    # REFRESH RATE
    # --------------------------------------------------------

    refresh_rate = row[
        "refresh_rate_hz"
    ]

    if pd.notna(refresh_rate):

        if refresh_rate >= 120:

            reasons.append(
                f"{format_number(refresh_rate)} Hz refresh rate "
                "supports smooth visual performance"
            )

        elif refresh_rate < 90:

            tradeoffs.append(
                f"{format_number(refresh_rate)} Hz refresh rate "
                "is lower than higher-refresh-rate options"
            )

    else:

        tradeoffs.append(
            "Refresh-rate information is unavailable"
        )

    # --------------------------------------------------------
    # PRICE
    # --------------------------------------------------------

    price = row["price"]

    budget_min = preferences.get(
        "budget_min"
    )

    budget_max = preferences.get(
        "budget_max"
    )

    if pd.notna(price):

        if (
            budget_min is not None
            and budget_max is not None
        ):

            if (
                price >= budget_min
                and price <= budget_max
            ):

                distance_from_min = (
                    price - budget_min
                )

                budget_range = (
                    budget_max - budget_min
                )

                if (
                    budget_range > 0
                    and distance_from_min
                    <= budget_range * 0.20
                ):

                    reasons.append(
                        f"₹{price:,.0f} price is close to "
                        "the lower end of your budget"
                    )

                else:

                    reasons.append(
                        f"₹{price:,.0f} price is within "
                        "your budget"
                    )

    # --------------------------------------------------------
    # RATING
    # --------------------------------------------------------

    rating = row["ratings"]

    if pd.notna(rating):

        if rating >= 4.3:

            reasons.append(
                f"{rating:.1f}/5 rating adds "
                "positive user feedback signal"
            )

    return reasons, tradeoffs


# ============================================================
# BUILD API-READY RESULT
# ============================================================

def build_api_result(
    ranked_candidates,
    preferences,
    top_k=5,
):

    results = []

    for _, row in ranked_candidates.head(
        top_k
    ).iterrows():

        reasons, tradeoffs = (
            generate_explanation(
                row,
                preferences,
            )
        )

        result = {
            "mobile_name": row[
                "mobile_name"
            ],

            "brand": row[
                "brand"
            ],

            "price": float(
                row["price"]
            ),

            "ratings": float(
                row["ratings"]
            ),

            "match_score": float(
                round(
                    row["match_score"],
                    2,
                )
            ),

            "specifications": {
                "ram_gb": format_number(
                    row["ram_gb"]
                ),

                "storage_gb": format_number(
                    row["storage_gb"]
                ),

                "battery_mah": format_number(
                    row["battery_mah"]
                ),

                "processor_speed_ghz": (
                    format_number(
                        row[
                            "processor_speed_ghz"
                        ]
                    )
                ),

                "display_size_inches": (
                    format_number(
                        row[
                            "display_size_inches"
                        ]
                    )
                ),

                "refresh_rate_hz": (
                    format_number(
                        row[
                            "refresh_rate_hz"
                        ]
                    )
                ),

                "has_5g": (
                    None
                    if pd.isna(
                        row["has_5g"]
                    )
                    else bool(
                        row["has_5g"]
                    )
                ),
            },

            "why_it_matches": reasons,

            "tradeoffs": tradeoffs,

            "image_url": row[
                "imgURL"
            ],
        }

        results.append(result)

    return results


# ============================================================
# COMPLETE RECOMMENDATION PIPELINE
# ============================================================

def recommend_phones(
    preferences,
    top_k=5,
):
    """
    Complete recommendation pipeline.

    1. Load data
    2. Build usage profile
    3. Apply hard filters
    4. Calculate feature scores
    5. Rank candidates
    6. Deduplicate phone models
    7. Generate explanations
    8. Return API-ready results
    """

    # --------------------------------------------------------
    # LOAD DATA
    # --------------------------------------------------------

    df = load_recommendation_data()

    # --------------------------------------------------------
    # USAGE PROFILE
    # --------------------------------------------------------

    usage_profile = build_usage_profile(
        preferences.get(
            "usage",
            ["general"],
        )
    )

    # --------------------------------------------------------
    # HARD FILTER
    # --------------------------------------------------------

    candidates = filter_candidates(
        df=df,
        budget_min=preferences.get(
            "budget_min"
        ),
        budget_max=preferences.get(
            "budget_max"
        ),
        min_ram_gb=preferences.get(
            "min_ram_gb"
        ),
        min_storage_gb=preferences.get(
            "min_storage_gb"
        ),
        requires_5g=preferences.get(
            "requires_5g",
            False,
        ),
        min_battery_mah=preferences.get(
            "min_battery_mah"
        ),
    )

    if candidates.empty:
        return []

    # --------------------------------------------------------
    # FEATURE SCORES
    # --------------------------------------------------------

    scored_candidates = (
        calculate_feature_scores(
            candidates=candidates,
            budget_min=preferences.get(
                "budget_min"
            ),
            budget_max=preferences.get(
                "budget_max"
            ),
            min_battery_mah=preferences.get(
                "min_battery_mah"
            ),
            preferred_display_min=(
                preferences.get(
                    "preferred_display_min"
                )
            ),
            preferred_display_max=(
                preferences.get(
                    "preferred_display_max"
                )
            ),
        )
    )

    # --------------------------------------------------------
    # RANK
    # --------------------------------------------------------

    ranked_candidates = rank_candidates(
        candidates=scored_candidates,
        priorities=preferences.get(
            "priorities",
            DEFAULT_PRIORITIES,
        ),
        usage_profile=usage_profile,
    )

    # --------------------------------------------------------
    # DEDUPLICATE
    # --------------------------------------------------------

    ranked_candidates = (
        deduplicate_phone_models(
            ranked_candidates
        )
    )

    # --------------------------------------------------------
    # API RESULT
    # --------------------------------------------------------

    return build_api_result(
        ranked_candidates=ranked_candidates,
        preferences=preferences,
        top_k=top_k,
    )


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    user_preferences = {

        "budget_min": 20_000,

        "budget_max": 50_000,

        "usage": [
            "gaming",
            "work",
        ],

        "min_ram_gb": 8,

        "min_storage_gb": 128,

        "requires_5g": True,

        "min_battery_mah": 4_500,

        "preferred_display_min": 6.3,

        "preferred_display_max": 6.8,

        "priorities": {
            "performance": 5,
            "battery": 4,
            "ram": 4,
            "storage": 3,
            "display": 2,
            "price": 5,
            "rating": 2,
            "refresh_rate": 3,
            "camera": 0,
        },
    }

    print("\n")
    print("#" * 80)
    print("PHONETIC SMARTPHONE RECOMMENDATION ENGINE")
    print("#" * 80)

    results = recommend_phones(
        preferences=user_preferences,
        top_k=5,
    )

    print("\n")
    print("=" * 80)
    print("FINAL API-READY RECOMMENDATIONS")
    print("=" * 80)

    for index, phone in enumerate(
        results,
        start=1,
    ):

        print("\n" + "-" * 80)

        print(
            f"#{index} "
            f"{phone['mobile_name']} "
            f"({phone['brand']})"
        )

        print(
            f"Price: ₹{phone['price']:,.0f}"
        )

        print(
            f"Rating: {phone['ratings']:.1f}/5"
        )

        print(
            f"Match Score: "
            f"{phone['match_score']:.2f}"
        )

        print("\nSpecifications:")

        for key, value in phone[
            "specifications"
        ].items():

            print(
                f"  {key}: {value}"
            )

        print("\nWhy it matches:")

        for reason in phone[
            "why_it_matches"
        ]:

            print(
                f"  ✓ {reason}"
            )

        print("\nTrade-offs:")

        if phone["tradeoffs"]:

            for tradeoff in phone[
                "tradeoffs"
            ]:

                print(
                    f"  • {tradeoff}"
                )

        else:

            print(
                "  None identified"
            )