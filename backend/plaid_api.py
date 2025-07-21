import os
import plaid
from plaid.api import plaid_api
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.institutions_get_by_id_request import InstitutionsGetByIdRequest
from datetime import date, timedelta
from dotenv import load_dotenv
load_dotenv()

PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")

if not PLAID_CLIENT_ID or not PLAID_SECRET:
    raise ValueError("PLAID_CLIENT_ID and PLAID_SECRET must be set in the environment.")

# Available environments are 'Production', 'Development', and 'Sandbox'
PLAID_ENV = os.getenv("PLAID_ENV", "sandbox")
PLAID_PRODUCTS = os.getenv("PLAID_PRODUCTS", "auth,transactions").split(",")
PLAID_COUNTRY_CODES = os.getenv("PLAID_COUNTRY_CODES", "US").split(",")


host = plaid.Environment.Sandbox
if PLAID_ENV == "production":
    host = plaid.Environment.Production

configuration = plaid.Configuration(
    host=host,
    api_key={
        "clientId": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
    },
)

api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

# Custom exception for Plaid API errors to improve error handling
class PlaidApiException(Exception):
    pass

def create_link_token(user_id: str, access_token: str = None):
    try:
        request = LinkTokenCreateRequest(
            user=LinkTokenCreateRequestUser(client_user_id=user_id),
            client_name="Horizon app",  # Name of your application, which will be displayed in the Plaid Link UI.
            products=[Products('auth')],
            country_codes=[CountryCode('US')],
            language="en",   # Language for the Link flow
            access_token=access_token if access_token else None # Include access_token for update mode
        )
        response = client.link_token_create(request)
        print(f"Successfully created Link Token: {response.link_token}")
        return response['link_token']
    except plaid.ApiException as e:
        # Raise a custom exception with details from the Plaid error
        raise PlaidApiException(e.body)

def exchange_public_token(public_token: str):
    request = ItemPublicTokenExchangeRequest(
        public_token=public_token
    )
    response = client.item_public_token_exchange(request)
    return {
        "access_token": response['access_token'],
        "item_id": response['item_id']
    }

def get_accounts(access_token: str):
    request = AccountsGetRequest(
        access_token=access_token
    )
    response = client.accounts_get(request)
    return {
        "accounts": [account.to_dict() for account in response['accounts']],
        "item": response['item'].to_dict()
    }

def get_transactions(access_token: str):
    # Set a reasonable date range for transactions (e.g., last 30 days)
    today = date.today()
    thirty_days_ago = today - timedelta(days=30)

    request = TransactionsGetRequest(
        access_token=access_token,
        start_date=thirty_days_ago,
        end_date=today,
    )
    response = client.transactions_get(request)
    return response['transactions']

def get_institution_by_id(institution_id: str):
    try:
        request = InstitutionsGetByIdRequest(
            institution_id=institution_id,
            country_codes=[CountryCode('US')],
            options={
                "include_optional_metadata": True
            }
        )
        response = client.institutions_get_by_id(request)
        return response['institution'].to_dict()
    except plaid.ApiException as e:
        print(f"Plaid API Error fetching institution {institution_id}: {e.body}")
        raise PlaidApiException(e.body)
    except Exception as e:
        print(f"Unexpected error fetching institution {institution_id}: {e}")
        raise e