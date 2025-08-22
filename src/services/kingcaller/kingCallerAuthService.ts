import { auth } from '@/lib/firebase';
import { 
  KingCallerTokens, 
  KingCallerAuthResponse, 
  RegisterUserRequest,
  LoginRequest,
  AuthResponse,
  ApiResponse,
  UserProfile
} from './kingCallerTypes';

export class KingCallerAuthService {
  private tokens: KingCallerTokens | null = null;
  private subAccountId: string | null = null;

  setSubAccount(subAccountId: string) {
    this.subAccountId = subAccountId;
    this.loadTokensFromStorage();
  }

  private getStorageKey(): string {
    return `kingcaller_tokens_${this.subAccountId}`;
  }

  private loadTokensFromStorage() {
    if (!this.subAccountId) return;
    
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        this.tokens = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading KingCaller tokens:', error);
      this.tokens = null;
    }
  }

  private saveTokensToStorage(tokens: KingCallerTokens) {
    if (!this.subAccountId) return;
    
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(tokens));
      this.tokens = tokens;
    } catch (error) {
      console.error('Error saving KingCaller tokens:', error);
    }
  }

  private clearTokensFromStorage() {
    if (!this.subAccountId) return;
    
    localStorage.removeItem(this.getStorageKey());
    this.tokens = null;
  }

  getCurrentSubAccountId(): string {
    // This should be dynamically retrieved from context
    // Will need to be injected when used
    return this.subAccountId || '';
  }

  async authenticate(): Promise<boolean> {
    console.log('KingCallerAuth: Authentication disabled - staging endpoint removed');
    return false;
  }

  private async loginWithFirebaseUser(user: any): Promise<boolean> {
    console.log('KingCallerAuth: Login disabled - staging endpoint removed');
    throw new Error('KingCaller API disabled - staging endpoint removed');
  }

  private async registerFirebaseUser(user: any): Promise<boolean> {
    console.log('KingCallerAuth: Registration disabled - staging endpoint removed');
    throw new Error('KingCaller API disabled - staging endpoint removed');
  }

  async refreshAccessToken(): Promise<boolean> {
    console.log('KingCallerAuth: Token refresh disabled - staging endpoint removed');
    return false;
  }

  async getValidAccessToken(): Promise<string | null> {
    console.log('KingCallerAuth: Token access disabled - staging endpoint removed');
    return null;
  }

  async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    console.log('KingCallerAuth: Authenticated requests disabled - staging endpoint removed');
    throw new Error('KingCaller API disabled - staging endpoint removed');
  }

  isAuthenticated(): boolean {
    return false; // Always false since API is disabled
  }

  getTokens(): KingCallerTokens | null {
    return null; // Always null since API is disabled
  }

  async registerUser(userData: RegisterUserRequest): Promise<AuthResponse> {
    console.log('KingCallerAuth: User registration disabled - staging endpoint removed');
    throw new Error('KingCaller API disabled - staging endpoint removed');
  }

  async loginUser(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('KingCallerAuth: User login disabled - staging endpoint removed');
    throw new Error('KingCaller API disabled - staging endpoint removed');
  }

  async getUserProfile(): Promise<UserProfile> {
    console.log('KingCallerAuth: User profile disabled - staging endpoint removed');
    throw new Error('KingCaller API disabled - staging endpoint removed');
  }

  async logout(): Promise<void> {
    this.clearTokensFromStorage();
    console.log('KingCallerAuth: Logout completed (API disabled)');
  }

  disconnect() {
    this.clearTokensFromStorage();
    console.log('KingCallerAuth: Disconnected (API disabled)');
  }
}
