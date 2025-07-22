
import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import sentry_sdk
import traceback
from pydantic import BaseModel
from typing import Optional
from plaid_api import create_link_token, exchange_public_token, get_accounts, get_transactions, get_institution_by_id, PlaidApiException
from supabase_api import create_user_in_db, get_user_from_db, save_bank_account_to_db, \
    get_bank_accounts_by_user_and_institution, get_bank_account_by_user_item_and_account_id, \
    get_bank_accounts_by_user_id

load_dotenv()
app = FastAPI()

origins = [
    "http://localhost:5173",  # Next.js frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GetTransactionsRequest(BaseModel):
    access_token: str


sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN"),
    traces_sample_rate=1.0,
)

class CreateLinkTokenRequest(BaseModel):
    user_id: str
    access_token: Optional[str] = None

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
            create_user_in_db(clerk_id, email, first_name, last_name)

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return {"status": "success"}

@app.get("/api/users/{clerk_id}")
async def get_user_by_clerk_id(clerk_id: str):
    try:
        user_data = get_user_from_db(clerk_id)
        return user_data
    except Exception as e:
        raise HTTPException(status_code=404, detail="User not found")

@app.post("/api/plaid/create_link_token")
async def get_link_token(request_body: CreateLinkTokenRequest):
    try:
        link_token = create_link_token(request_body.user_id, request_body.access_token)
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
        return accounts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ExchangePublicTokenRequest(BaseModel):
    public_token: str

class CreateBankAccountRequest(BaseModel):
    user_id: str
    access_token: str
    item_id: str
    account_id: str
    bank_name: str
    mask: str
    official_name: str
    subtype: str
    account_type: str
    current_balance: float
    available_balance: float
    shareable_id: str
    bank_type: str
    institution_id: str # New field

@app.get("/api/institutions/{institution_id}")
async def get_institution_details(institution_id: str):
    try:
        institution = get_institution_by_id(institution_id)
        return institution
    except PlaidApiException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bank_accounts/{clerk_id}")
async def get_user_bank_accounts(clerk_id: str):
    try:
        # First, get the internal user ID from the clerk_id
        user = get_user_from_db(clerk_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Then, use the internal user ID to get bank accounts
        bank_accounts = get_bank_accounts_by_user_id(user['id'])
        return bank_accounts
    except Exception as e:
        print(f"----------- UNCAUGHT EXCEPTION IN /api/bank_accounts/{clerk_id} -----------")
        traceback.print_exc()
        print("--------------------------------------------------------------------------")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bank_accounts/check_institution/{user_id}/{institution_id}")
async def check_institution_linked(user_id: str, institution_id: str):
    try:
        existing_banks = get_bank_accounts_by_user_and_institution(user_id, institution_id)
        return {"is_linked": bool(existing_banks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/bank_accounts/create")
async def create_bank_account(request_body: CreateBankAccountRequest):
    try:
        # Check for exact duplicate account (user_id, item_id, account_id)
        existing_account = get_bank_account_by_user_item_and_account_id(
            request_body.user_id,
            request_body.item_id,
            request_body.account_id
        )
        if existing_account:
            raise HTTPException(status_code=409, detail="This specific bank account is already linked.")

        bank_account_data = save_bank_account_to_db(
            user_id=request_body.user_id,
            access_token=request_body.access_token,
            item_id=request_body.item_id,
            account_id=request_body.account_id,
            bank_name=request_body.bank_name,
            mask=request_body.mask,
            official_name=request_body.official_name,
            subtype=request_body.subtype,
            account_type=request_body.account_type,
            current_balance=request_body.current_balance,
            available_balance=request_body.available_balance,
            shareable_id=request_body.shareable_id,
            bank_type=request_body.bank_type,
            institution_id=request_body.institution_id # Pass new field
        )
        return bank_account_data
    except Exception as e:
        print("----------- UNCAUGHT EXCEPTION IN /api/bank_accounts/create -----------")
        traceback.print_exc()
        print("--------------------------------------------------------------------------")
        raise HTTPException(status_code=500, detail=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/plaid/exchange_public_token")
async def exchange_token(request_body: ExchangePublicTokenRequest):
    try:
        response_data = exchange_public_token(request_body.public_token)
        return {"access_token": response_data["access_token"], "item_id": response_data["item_id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))