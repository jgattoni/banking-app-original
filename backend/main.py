
import os
from fastapi import FastAPI, Request, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
import sentry_sdk
from pydantic import BaseModel
from plaid_api import create_link_token, exchange_public_token, get_accounts, get_transactions, PlaidApiException

load_dotenv()
app = FastAPI()

class GetTransactionsRequest(BaseModel):
    access_token: str


sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN"),
    traces_sample_rate=1.0,
)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

class CreateLinkTokenRequest(BaseModel):
    user_id: str

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

@app.get("/api/users/{clerk_id}")
async def get_user_by_clerk_id(clerk_id: str):
    try:
        response = supabase.table("users").select("*").eq("clerk_id", clerk_id).single().execute()
        return response.data
    except Exception as e:
        # This will catch the error if no user is found (or other DB errors)
        raise HTTPException(status_code=404, detail="User not found")

@app.post("/api/plaid/create_link_token")
async def get_link_token(request_body: CreateLinkTokenRequest):
    try:
        link_token = create_link_token(request_body.user_id)
        return {"link_token": link_token}
    except PlaidApiException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/plaid/transactions")
async def get_plaid_transactions(request_body: GetTransactionsRequest):
    try:
        transactions = get_transactions(request_body.access_token)
        return {"transactions": transactions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class GetAccountsRequest(BaseModel):
    access_token: str

@app.post("/api/plaid/accounts")
async def get_plaid_accounts(request_body: GetAccountsRequest):
    try:
        accounts = get_accounts(request_body.access_token)
        return {"accounts": accounts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ExchangePublicTokenRequest(BaseModel):
    public_token: str

@app.post("/api/plaid/exchange_public_token")
async def exchange_token(request_body: ExchangePublicTokenRequest):
    try:
        access_token = exchange_public_token(request_body.public_token)
        return {"access_token": access_token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))