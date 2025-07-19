'use server';

import { parseStringify } from "../utils";

export const getUserInfo = async ({ userId }: { userId: string }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`);
    if (!response.ok) {
      // Handle case where user is not found in the database yet
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching user info: ${response.statusText}`);
    }
    const userInfo = await response.json();
    return parseStringify(userInfo);
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
}

export const createLinkToken = async (user: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plaid/create_link_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user.id // Use the Clerk user ID
      })
    })
    const data = await response.json();
    return parseStringify({ linkToken: data.link_token })
  } catch (error) {
    console.log(error);
  }
}

export const exchangePublicToken = async ({
  publicToken,
  user,
}: { publicToken: string, user: any }) => {
  try {
    // Exchange public token for access token and item ID
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plaid/exchange_public_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ public_token: publicToken })
    });

    const data = await response.json();
    const accessToken = data.access_token;
    
    // Get account information from Plaid using the access token
    const accountsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plaid/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ access_token: accessToken })
    });
    const accountData = await accountsResponse.json();

    // NOTE: The following logic for Dwolla and creating a bank account
    // will need to be implemented in the backend.
    // For now, we will just return a success message.

    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
}
