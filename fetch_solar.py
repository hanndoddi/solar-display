import os, json, requests, base64
from datetime import datetime, timezone

API_KEY       = os.environ["ENPHASE_API_KEY"].strip()
CLIENT_ID     = os.environ["ENPHASE_CLIENT_ID"].strip()
CLIENT_SECRET = os.environ["ENPHASE_CLIENT_SECRET"].strip()
USERNAME      = os.environ["ENPHASE_USERNAME"].strip()
PASSWORD      = os.environ["ENPHASE_PASSWORD"].strip()
SYSTEM_ID     = os.environ["ENPHASE_SYSTEM_ID"].strip()

# Get access token using password grant
credentials = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
token_resp = requests.post(
    "https://api.enphaseenergy.com/oauth/token",
    params={
        "grant_type": "password",
        "username":   USERNAME,
        "password":   PASSWORD,
    },
    headers={"Authorization": f"Basic {credentials}"},
)
token_resp.raise_for_status()
access_token = token_resp.json()["access_token"]
print("Got access token!")

# Fetch solar data
headers = {"Authorization": f"Bearer {access_token}"}
summary_resp = requests.get(
    f"https://api.enphaseenergy.com/api/v4/systems/{SYSTEM_ID}/summary",
    params={"key": API_KEY},
    headers=headers,
)
summary_resp.raise_for_status()
summary = summary_resp.json()

# Save data.json
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
