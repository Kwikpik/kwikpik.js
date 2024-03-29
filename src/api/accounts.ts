import { KwikPikHTTPsAgent } from "../https";
import config from "../config.json";
import { replace, toString } from "lodash";
import { RequestMessage } from "./requests";

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
  createdAt: string;

  /**
   * When the account was updated
   */
  updatedAt: string;

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
  createdAt: string;

  /**
   * When the wallet was updated
   */
  updatedAt: string;
}

interface AccountRequestResponse extends RequestMessage {
  id: string;
  status:
    | "CANCELLED"
    | "DELIVERED"
    | "INIT_RIDE_REQUEST"
    | "CONFIRMED_RIDE_REQUEST";
  riderId: string | null;
  inTransit: boolean;
  createdAt: string;
}

export class Accounts {
  private agent: KwikPikHTTPsAgent;

  protected constructor(apiKey: string, environment: "dev" | "prod" = "prod") {
    this.agent = new KwikPikHTTPsAgent(apiKey, environment);
  }

  /**
   *
   * @param apiKey Your Kwik-Pik API key
   * @param environment dev or prod (development or production)
   * @returns
   * @description Initializes an account object
   */
  static initialize(apiKey: string, environment?: "dev" | "prod") {
    return new Accounts(apiKey, environment);
  }

  /**
   *
   * @returns
   * @description Returns the business account
   */
  public authenticate() {
    return this.agent.createKwikPikCallableInstance<Account>(
      config.paths.account.authenticate,
      "get"
    );
  }

  /**
   *
   * @returns
   * @description Returns a user's wallet
   */
  public wallet() {
    return this.agent.createKwikPikCallableInstance<AccountWallet>(
      config.paths.account.get_wallet,
      "get"
    );
  }

  /**
   *
   * @param page Page to navigate to in the request. If this isn't specified, the first page is active. It returns just 20 items.
   * @description Returns a list of requests made with this account. An authentication is first executed.
   * @returns
   */
  public async getAccountRequests(page: number = 1) {
    try {
      const account = await this.authenticate().call();
      const query = new URLSearchParams({ page: toString(page) });
      const path = replace(
        config.paths.requests.get_requests_by_account,
        ":userId",
        account.id
      ).concat("?", query.toString());
      return this.agent.createKwikPikCallableInstance<AccountRequestResponse[]>(
        path,
        "get"
      );
    } catch (error: any) {
      return Promise.reject(error);
    }
  }
}
