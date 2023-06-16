import { KwikPikHTTPsAgent } from "../https";
import config from "../config.json";

interface Account {
  /**
   * Name of your business
   */
  name: string;

  /**
   *  Account id
   */
  id: string;

  /**
   *  Account email
   */
  email: string;

  /**
   *  Account phone number
   */
  phoneNumber: string;

  /**
   * When the account was created
   */
  createdAt: Date;

  /**
   * When the account was updated
   */
  updatedAt: Date;

  /**
   *  Authentication token
   */
  token?: string;

  /**
   * If this account has been verified
   */
  isVerified: boolean;
}

interface AccountWallet {
  /**
   * Wallet id
   */
  id: string;

  /**
   * ID of account associated with this wallet
   */
  userId: string;

  /**
   *  Wallet's balance
   */
  balance: number;

  /**
   * Wallet's pending payment
   */
  bookBalance: number;

  /**
   * When the wallet was created
   */
  createdAt: Date;

  /**
   * When the wallet was updated
   */
  updatedAt: Date;
}

export class Accounts {
  private agent: KwikPikHTTPsAgent;

  protected constructor(apiKey: string, environment: "dev" | "prod" = "prod") {
    this.agent = new KwikPikHTTPsAgent(apiKey, environment);
  }

  static initialize(apiKey: string, environment?: "dev" | "prod") {
    return new Accounts(apiKey, environment);
  }

  public authenticate() {
    return this.agent.createKwikPikCallableInstance<Account>(config.paths.account.authenticate, "get");
  }

  public wallet() {
    return this.agent.createKwikPikCallableInstance<AccountWallet>(config.paths.account.get_wallet, "get");
  }
}
