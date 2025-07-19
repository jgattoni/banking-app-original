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
