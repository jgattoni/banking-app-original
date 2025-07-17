from plaid import PlaidApi, Configuration, Environment
import os

PLAID_CLIENT_ID = os.environ.get("PLAID_CLIENT_ID")
PLAID_SECRET = os.environ.get("PLAID_SECRET")
PLAID_ENV = os.environ.get("PLAID_ENV", "sandbox")

# Plaid configuration
configuration = Configuration(
    host=Environment[PLAID_ENV],
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
    }
)

plaid_client = PlaidApi(configuration)

from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser

def create_link_token(user_id: str):
    request = LinkTokenCreateRequest(
        products=["auth", "transactions"],
        client_name="Banking App",
        country_codes=["US"],
        language="en",
        user=LinkTokenCreateRequestUser(client_user_id=user_id),
    )
    response = plaid_client.link_token_create(request)
    return response.link_token

from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest

def exchange_public_token(public_token: str):
    request = ItemPublicTokenExchangeRequest(
        public_token=public_token
    )
    response = plaid_client.item_public_token_exchange(request)
    return response.access_token

from plaid.model.accounts_get_request import AccountsGetRequest

def get_accounts(access_token: str):
    request = AccountsGetRequest(
        access_token=access_token
    )
    response = plaid_client.accounts_get(request)
    return response.accounts

from plaid.model.transactions_get_request import TransactionsGetRequest
from datetime import date, timedelta

def get_transactions(access_token: str):
    # Set a reasonable date range for transactions (e.g., last 30 days)
    today = date.today()
    thirty_days_ago = today - timedelta(days=30)

    request = TransactionsGetRequest(
        access_token=access_token,
        start_date=thirty_days_ago,
        end_date=today,
    )
    response = plaid_client.transactions_get(request)
    return response.transactions
