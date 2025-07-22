class AccountService {
  private baseUrl = import.meta.env.VITE_BACKEND_URL;

  private transformAccountData(apiAccount: any): Bank {
    return {
      ...apiAccount,
      currentBalance: apiAccount.current_balance,
      availableBalance: apiAccount.available_balance,
      bankName: apiAccount.bank_name,
      officialName: apiAccount.official_name,
    };
  }

  async getAccountsByUserId(userId: string): Promise<Bank[]> {
    const response = await fetch(`${this.baseUrl}/api/bank_accounts/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch accounts: ${response.statusText}`);
    }

    const apiData = await response.json();
    return apiData.map(this.transformAccountData);
  }

  async getAccountById(accountId: string): Promise<Bank> {
    const response = await fetch(`${this.baseUrl}/api/bank_accounts/bank/${accountId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch account: ${response.statusText}`);
    }

    const apiData = await response.json();
    return this.transformAccountData(apiData);
  }

  async updateAccount(accountId: string, updates: Partial<Bank>): Promise<Bank> {
    const apiPayload = {
      ...updates,
      current_balance: updates.currentBalance,
      available_balance: updates.availableBalance,
      bank_name: updates.bankName,
      official_name: updates.officialName,
    };

    const response = await fetch(`${this.baseUrl}/api/bank_accounts/${accountId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update account: ${response.statusText}`);
    }

    const apiData = await response.json();
    return this.transformAccountData(apiData);
  }
}

export const accountService = new AccountService();
