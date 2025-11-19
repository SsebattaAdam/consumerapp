import supabase from '../../../core/services/supabaseClient';

export interface AuthUser {
  id: string;
  email: string | null;
  username: string | null;
}

class AuthRepository {
  async register(email: string, username: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    const { user } = session;
    return {
      id: user.id,
      email: user.email,
      username: user.user_metadata?.username ?? null,
    };
  }
}

export default new AuthRepository();



