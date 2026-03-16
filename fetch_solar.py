import os, json, requests
from datetime import datetime, timezone
from github import Github

API_KEY       = os.environ["ENPHASE_API_KEY"]
CLIENT_ID     = os.environ["ENPHASE_CLIENT_ID"]
CLIENT_SECRET = os.environ["ENPHASE_CLIENT_SECRET"]
REFRESH_TOKEN = os.environ["ENPHASE_REFRESH_TOKEN"]
SYSTEM_ID     = os.environ["ENPHASE_SYSTEM_ID"]
GITHUB_TOKEN  = os.environ["GITHUB_TOKEN"]
REPO_NAME     = os.environ["REPO_NAME"]

# --- Step 1: Refresh the access token ---
token_resp = requests.post(
    "https://api.enphaseenergy.com/oauth/token",
    params={
        "grant_type":    "refresh_token",
        "refresh_token": REFRESH_TOKEN,
    },
    auth=(CLIENT_ID, CLIENT_SECRET),
)
token_resp.raise_for_status()
tokens        = token_resp.json()
access_token  = tokens["access_token"]
new_refresh   = tokens["refresh_token"]

# --- Step 2: Save new refresh token to GitHub Secrets ---
gh   = Github(GITHUB_TOKEN)
repo = gh.get_repo(REPO_NAME)
repo.create_secret("ENPHASE_REFRESH_TOKEN", new_refresh)
print("Refresh token updated in GitHub Secrets")

# --- Step 3: Fetch solar data ---
headers = {"Authorization": f"Bearer {access_token}"}
base    = f"https://api.enphaseenergy.com/api/v4/systems/{SYSTEM_ID}"

summary_resp = requests.get(
    f"{base}/summary",
    params={"key": API_KEY},
    headers=headers,
)
summary_resp.raise_for_status()
summary = summary_resp.json()

# --- Step 4: Build and save data.json ---
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
