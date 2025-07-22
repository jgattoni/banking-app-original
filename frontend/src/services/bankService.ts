class BankService {
  private baseUrl = import.meta.env.VITE_BACKEND_URL;

  private transformBankData(apiBank: any): Bank {
    return {
        id: apiBank.id,
        createdAt: apiBank.created_at,
        updatedAt: apiBank.updated_at,
        userId: apiBank.user_id,
        accessToken: apiBank.access_token,
        itemId: apiBank.item_id,
        accountId: apiBank.account_id,
        bankName: apiBank.bank_name,
        mask: apiBank.mask,
        officialName: apiBank.official_name,
        subtype: apiBank.subtype,
        type: apiBank.type,
        currentBalance: apiBank.current_balance,
        availableBalance: apiBank.available_balance,
        shareableId: apiBank.shareable_id,
        bankType: apiBank.bank_type,
        institutionId: apiBank.institution_id,
    };
  }

  async getBanksByUserId(userId: string): Promise<Bank[]> {
    const response = await fetch(`${this.baseUrl}/api/bank_accounts/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch banks: ${response.statusText}`);
    }

    const apiData = await response.json();
    return apiData.map(this.transformBankData);
  }

  async getBankById(bankId: string): Promise<Bank> {
    const response = await fetch(`${this.baseUrl}/api/bank_accounts/bank/${bankId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bank: ${response.statusText}`);
    }

    const apiData = await response.json();
    return this.transformBankData(apiData);
  }

  async updateBank(bankId: string, updates: Partial<Bank>): Promise<Bank> {
    const apiPayload = {
        id: updates.id,
        createdAt: updates.createdAt,
        updatedAt: updates.updatedAt,
        userId: updates.userId,
        accessToken: updates.accessToken,
        itemId: updates.itemId,
        accountId: updates.accountId,
        bankName: updates.bankName,
        mask: updates.mask,
        officialName: updates.officialName,
        subtype: updates.subtype,
        type: updates.type,
        currentBalance: updates.currentBalance,
        availableBalance: updates.availableBalance,
        shareableId: updates.shareableId,
        bankType: updates.bankType,
        institutionId: updates.institutionId,
    };

    const response = await fetch(`${this.baseUrl}/api/bank_accounts/${bankId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update bank: ${response.statusText}`);
    }

    const apiData = await response.json();
    return this.transformBankData(apiData);
  }
}

export const bankService = new BankService();
