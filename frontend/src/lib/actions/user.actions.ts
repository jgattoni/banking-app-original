import { parseStringify } from "../utils";
import { UserResource } from "@clerk/types";

export const getUserInfo = async ({ userId }: { userId: string }) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      // Handle case where user is not found in the database yet
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching user info: ${response.statusText}`);
    }
    const userInfo: User = await response.json();
    return parseStringify(userInfo);
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
}

export const getBanks = async ({ userId }: getAccountsProps) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/banks`);
    const banks = await response.json();
    return parseStringify(banks);
  } catch (error) {
    console.error("An error occurred while getting the banks:", error);
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/banks/${documentId}`);
    const bank = await response.json();
    return parseStringify(bank);
  } catch (error) {
    console.error("An error occurred while getting the bank:", error);
  }
};

export const createLinkToken = async (user: UserResource, accessToken?: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/plaid/create_link_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user.id, // Use the database clerk ID
        access_token: accessToken // Pass optional access token for update mode
      })
    });
    const data = await response.json();
    return parseStringify({ linkToken: data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({ publicToken }: { publicToken: string }) => {
  try {
    const response = await fetch(`/api/plaid/exchange_public_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ public_token: publicToken })
    });

    const data = await response.json();
    return parseStringify({ accessToken: data.access_token, itemId: data.item_id });
  } catch (error) {
    console.error("An error occurred while exchanging public token:", error);
    throw error; // Re-throw to be caught by the caller
  }
};

export const savePlaidAccounts = async ({
  accessToken,
  itemId,
  user,
}: { accessToken: string; itemId: string; user: UserResource }) => {
  try {
    // Fetch the user's Supabase ID using their Clerk ID
    const userInfo = await getUserInfo({ userId: user.id });

    if (!userInfo || !userInfo.id) {
      throw new Error("Could not retrieve Supabase user ID.");
    }

    const supabaseUserId = userInfo.id;

    // Get account information from Plaid using the access token
    const accountsResponse = await fetch(`/api/plaid/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ access_token: accessToken })
    });

    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text();
      throw new Error(`Backend /api/plaid/accounts error: ${accountsResponse.status} - ${errorText}`);
    }

    const accountData = await accountsResponse.json();
    const accounts = accountData.accounts;
    const institutionId = accountData.item.institution_id; // Extract institution_id

    // Iterate through all accounts and save them to Supabase
    for (const account of accounts) {
      const bankAccountPayload = {
        user_id: supabaseUserId, // Use the Supabase user ID here
        access_token: accessToken,
        item_id: itemId,
        account_id: account.account_id,
        bank_name: account.name,
        mask: account.mask,
        official_name: account.official_name,
        subtype: account.subtype,
        account_type: account.type,
        current_balance: account.balances.current,
        available_balance: account.balances.available,
        shareable_id: account.account_id, // You might want to generate a proper shareable ID
        bank_type: "Plaid", // Set bank type to Plaid
        institution_id: institutionId, // Include institution_id
      };

      // Save bank account to Supabase via backend
      const saveBankResponse = await fetch(`/api/bank_accounts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bankAccountPayload)
      });

      if (!saveBankResponse.ok) {
        // If the backend returns a 409 Conflict (account already linked), we can skip it
        if (saveBankResponse.status === 409) {
          console.warn(`Account ${account.account_id} from ${account.name} is already linked. Skipping.`);
          continue; // Skip to the next account
        }
        throw new Error(`Failed to save bank account: ${saveBankResponse.statusText}`);
      }
    }

    return parseStringify({ publicTokenExchange: "complete" });
  } catch (error) {
    console.error("An error occurred while saving Plaid accounts:", error);
    throw error; // Re-throw to be caught by the caller
  }
};
