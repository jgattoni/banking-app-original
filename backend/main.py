
import os
from fastapi import FastAPI, Request, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
import sentry_sdk

load_dotenv()

sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN"),
    traces_sample_rate=1.0,
)

app = FastAPI()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

@app.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/api/webhooks/user")
async def user_webhook(request: Request):
    payload = await request.json()
    event_type = payload.get("type")

    if event_type == "user.created":
        user_data = payload.get("data")
        clerk_id = user_data.get("id")
        email = user_data.get("email_addresses")[0].get("email_address")
        first_name = user_data.get("first_name")
        last_name = user_data.get("last_name")

        try:
            response = supabase.table("users").insert({
                "clerk_id": clerk_id,
                "email": email,
                "first_name": first_name,
                "last_name": last_name
            }).execute()

            

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return {"status": "success"}

