import os
from supabase import create_client, Client
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def create_user_in_db(clerk_id: str, email: str, first_name: str, last_name: str):
    try:
        response = supabase.table("users").insert({
            "clerk_id": clerk_id,
            "email": email,
            "first_name": first_name,
            "last_name": last_name
        }).execute()
        if response.data:
            return response.data
        else:
            raise HTTPException(status_code=500, detail="Failed to create user in Supabase: No data returned.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user in Supabase: {str(e)}")

def get_user_from_db(clerk_id: str):
    try:
        response = supabase.table("users").select("*").eq("clerk_id", clerk_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=404, detail="User not found")

def save_bank_account_to_db(
    user_id: str,
    access_token: str,
    item_id: str,
    account_id: str,
    bank_name: str,
    mask: str,
    official_name: str,
    subtype: str,
    account_type: str,
    current_balance: float,
    available_balance: float,
    shareable_id: str,
    bank_type: str
):
    try:
        response = supabase.table("banks").insert({
            "user_id": user_id,
            "access_token": access_token,
            "item_id": item_id,
            "account_id": account_id,
            "bank_name": bank_name,
            "mask": mask,
            "official_name": official_name,
            "subtype": subtype,
            "type": account_type,
            "current_balance": current_balance,
            "available_balance": available_balance,
            "shareable_id": shareable_id,
            "bank_type": bank_type
        }).execute()
        if response.data:
            return response.data
        else:
            raise HTTPException(status_code=500, detail="Failed to save bank account to Supabase: No data returned.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving bank account to Supabase: {str(e)}")
