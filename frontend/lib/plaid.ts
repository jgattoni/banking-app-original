export async function createLinkToken(userId: string) {
  try {
    const response = await fetch('/api/plaid/create_link_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.link_token;
  } catch (error) {
    console.error('Error creating link token:', error);
    throw error;
  }
}

export async function exchangePublicToken(publicToken: string) {
  try {
    const response = await fetch('/api/plaid/exchange_public_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token: publicToken }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error exchanging public token:', error);
    throw error;
  }
}

export async function getAccounts(accessToken: string) {
  try {
    const response = await fetch('/api/plaid/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.accounts;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
}

export async function getTransactions(accessToken: string) {
  try {
    const response = await fetch('/api/plaid/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}