import { supabase } from './supabase';

export interface CustomUser {
  id: string;
  email: string;
  password: string;
  is_verified: boolean;
  created_at: string;
}

export interface VerificationCode {
  id: string;
  user_id: string;
  email: string;
  code: string;
  expires_at: string;
  used: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: CustomUser;
  needsVerification?: boolean;
}

// Generate 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate session token
export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Sign up user with email and password (unhashed)
export async function signUpUser(email: string, password: string): Promise<AuthResponse> {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('custom_users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists'
      };
    }

    // Create new user
    const { data: newUser, error: userError } = await supabase
      .from('custom_users')
      .insert([
        {
          email,
          password, // Storing unhashed as requested
          is_verified: false
        }
      ])
      .select()
      .single();

    if (userError) {
      return {
        success: false,
        message: 'Failed to create user: ' + userError.message
      };
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store verification code
    const { error: codeError } = await supabase
      .from('verification_codes')
      .insert([
        {
          user_id: newUser.id,
          email,
          code: verificationCode,
          expires_at: expiresAt.toISOString(),
          used: false
        }
      ]);

    if (codeError) {
      return {
        success: false,
        message: 'Failed to generate verification code: ' + codeError.message
      };
    }

    // In a real app, you would send the code via email here
    console.log(`Verification code for ${email}: ${verificationCode}`);

    return {
      success: true,
      message: 'Check your email for verification code',
      user: newUser,
      needsVerification: true
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'An unexpected error occurred: ' + error.message
    };
  }
}

// Sign in user with email and password
export async function signInUser(email: string, password: string): Promise<AuthResponse> {
  try {
    // Find user by email and password (unhashed comparison)
    const { data: user, error } = await supabase
      .from('custom_users')
      .select('*')
      .eq('email', email)
      .eq('password', password) // Direct comparison since password is unhashed
      .single();

    if (error || !user) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    if (!user.is_verified) {
      // Generate new verification code for unverified users
      const verificationCode = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await supabase
        .from('verification_codes')
        .insert([
          {
            user_id: user.id,
            email,
            code: verificationCode,
            expires_at: expiresAt.toISOString(),
            used: false
          }
        ]);

      console.log(`Verification code for ${email}: ${verificationCode}`);

      return {
        success: false,
        message: 'Please verify your email first. Check your email for verification code.',
        user,
        needsVerification: true
      };
    }

    // Create session
    const sessionToken = generateSessionToken();
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await supabase
      .from('user_sessions')
      .insert([
        {
          user_id: user.id,
          session_token: sessionToken,
          expires_at: sessionExpiresAt.toISOString()
        }
      ]);

    // Store session in localStorage
    localStorage.setItem('auth_token', sessionToken);
    localStorage.setItem('user_id', user.id);

    return {
      success: true,
      message: 'Successfully signed in',
      user
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'An unexpected error occurred: ' + error.message
    };
  }
}

// Verify email with code
export async function verifyEmail(email: string, code: string): Promise<AuthResponse> {
  try {
    // Find valid verification code
    const { data: verificationRecord, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (codeError || !verificationRecord) {
      return {
        success: false,
        message: 'Invalid or expired verification code'
      };
    }

    // Mark code as used
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verificationRecord.id);

    // Mark user as verified
    const { data: user, error: userError } = await supabase
      .from('custom_users')
      .update({ is_verified: true })
      .eq('id', verificationRecord.user_id)
      .select()
      .single();

    if (userError) {
      return {
        success: false,
        message: 'Failed to verify user: ' + userError.message
      };
    }

    // Create session
    const sessionToken = generateSessionToken();
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await supabase
      .from('user_sessions')
      .insert([
        {
          user_id: user.id,
          session_token: sessionToken,
          expires_at: sessionExpiresAt.toISOString()
        }
      ]);

    // Store session in localStorage
    localStorage.setItem('auth_token', sessionToken);
    localStorage.setItem('user_id', user.id);

    return {
      success: true,
      message: 'Email verified successfully! Welcome to eFootball 26',
      user
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'An unexpected error occurred: ' + error.message
    };
  }
}

// Check if user is authenticated
export async function getCurrentUser(): Promise<CustomUser | null> {
  try {
    const authToken = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');

    if (!authToken || !userId) {
      return null;
    }

    // Check if session is valid
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_token', authToken)
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      // Invalid session, clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      return null;
    }

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('custom_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

// Sign out user
export async function signOutUser(): Promise<void> {
  try {
    const authToken = localStorage.getItem('auth_token');
    
    if (authToken) {
      // Delete session from database
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_token', authToken);
    }

    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  } catch (error) {
    // Clear localStorage even if database operation fails
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  }
}

// Resend verification code
export async function resendVerificationCode(email: string): Promise<AuthResponse> {
  try {
    // Find user
    const { data: user, error: userError } = await supabase
      .from('custom_users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    if (user.is_verified) {
      return {
        success: false,
        message: 'User is already verified'
      };
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error: codeError } = await supabase
      .from('verification_codes')
      .insert([
        {
          user_id: user.id,
          email,
          code: verificationCode,
          expires_at: expiresAt.toISOString(),
          used: false
        }
      ]);

    if (codeError) {
      return {
        success: false,
        message: 'Failed to send verification code: ' + codeError.message
      };
    }

    console.log(`New verification code for ${email}: ${verificationCode}`);

    return {
      success: true,
      message: 'New verification code sent to your email'
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'An unexpected error occurred: ' + error.message
    };
  }
}
