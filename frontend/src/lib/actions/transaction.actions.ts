import { parseStringify } from "../utils";

export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    const newTransaction = await response.json();
    return parseStringify(newTransaction);
  } catch (error) {
    console.log(error);
  }
}

export const getTransactionsByBankId = async ({ bankId }: getTransactionsByBankIdProps) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/banks/${bankId}/transactions`);
    const transactions = await response.json();
    return parseStringify(transactions);
  } catch (error) {
    console.log(error);
  }
}