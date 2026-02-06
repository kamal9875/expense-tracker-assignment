import requests
from django.conf import settings

def fetch_rates(base: str = "USD"):
    # Uses exchangerate.host (no API key required)
    url = f"{settings.EXCHANGE_API_BASE}/latest"
    resp = requests.get(url, params={"base": base}, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    # Expected: { "base": "USD", "rates": {...}, "date": "YYYY-MM-DD" }
    return {
        "base": data.get("base", base),
        "date": data.get("date"),
        "rates": data.get("rates", {}),
    }
