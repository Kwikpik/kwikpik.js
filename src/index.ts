import { ary } from "lodash";
import { Requests, Accounts } from "./api";

interface KwikPikAPI {
  accounts: Accounts;
  requests: Requests;
}

export const initializeAPI: (
  apiKey: string,
  environment?: "dev" | "prod"
) => KwikPikAPI = ary(
  (apiKey: string, environment: "dev" | "prod" = "prod") => ({
    accounts: Accounts.initialize(apiKey, environment),
    requests: Requests.initialize(apiKey, environment)
  }),
  2
);

export { Requests, Accounts };
