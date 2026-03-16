import os, json, requests
from datetime import datetime, timezone

API_KEY      = os.environ["ENPHASE_API_KEY"].strip()
ACCESS_TOKEN = os.environ["ENPHASE_ACCESS_TOKEN"].strip()
SYSTEM_ID    = os.environ["ENPHASE_SYSTEM_ID"].strip()

# Fetch solar data
headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
base    = f"https://api.enphaseenergy.com/api/v4/systems/{SYSTEM_ID}"

summary_resp = requests.get(
    f"{base}/summary",
    params={"key": API_KEY},
    headers=headers,
)
summary_resp.raise_for_status()
summary = summary_resp.json()

# Build and save data.json
data = {
    "updated_at":         datetime.now(timezone.utc).isoformat(),
    "status":             summary.get("status"),
    "current_power_w":    summary.get("current_power"),
    "energy_today_wh":    summary.get("energy_today"),
    "energy_lifetime_wh": summary.get("energy_lifetime"),
    "system_size_w":      summary.get("size_w"),
}

with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

print("data.json saved:", data)
