class UserService {
  private baseUrl = import.meta.env.VITE_BACKEND_URL;

  private transformUserData(apiUser: any): LoggedInUserProfile {
    return {
      id: apiUser.id,
      clerkId: apiUser.clerk_id,
      firstName: apiUser.first_name,
      lastName: apiUser.last_name,
      email: apiUser.email,
      createdAt: apiUser.created_at,
      updatedAt: apiUser.updated_at,
    };
  }

  async getUserById(userId: string): Promise<LoggedInUserProfile> {
    const response = await fetch(`${this.baseUrl}/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const apiData = await response.json();
    return this.transformUserData(apiData);
  }

  async updateUser(userId: string, updates: Partial<LoggedInUserProfile>): Promise<UserProfile> {
    const apiPayload = {
      ...updates,
      first_name: updates.firstName,
      last_name: updates.lastName,
    };

    const response = await fetch(`${this.baseUrl}/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }

    const apiData = await response.json();
    return this.transformUserData(apiData);
  }
}

export const userService = new UserService();
