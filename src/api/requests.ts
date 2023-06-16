import assert from "assert";
import { KwikPikHTTPsAgent } from "../https";
import { forEach } from "lodash";
import requestsSchema from "../schemas/requests";
import config from "../config.json";

interface Request {
  /**
   * Latitude of the pickup location.
   */
  latitude: number;

  /**
   * Longitude of the pickup location.
   */
  longitude: number;

  /**
   * Product category e.g food
   */
  category: string;

  /**
   * Exact product e.g rice & chicken
   */
  product: string;

  /**
   * A description of the product
   */
  description?: string;

  /**
   * Product weight (in KG)
   */
  weight?: number;

  /**
   * How many of this product are you putting up for delivery?
   */
  quantity?: number;

  /**
   * Base64-encoded string representation of the product's image
   */
  image?: string;

  /**
   * Latitude of the delivery location.
   */
  destinationLatitude: number;

  /**
   * Longitude of the delivery location.
   */
  destinationLongitude: number;

  /**
   * Preferred vehicle for the delivery
   */
  vehicleType: "car" | "bus" | "bicycle" | "truck" | "van" | "motorcycle";

  /**
   * Name of the recipient to deliver this pacakge to
   */
  recipientName: string;

  /**
   * Phone number of the recipient to deliver this package to
   */
  recipientPhoneNumber: string;

  /**
   * How much this package costs in the market
   */
  packageValue?: number;

  /**
   * This number would receive the protection code for this delivery
   */
  phoneNumber: number;
}

type InitRequestResponse = Request & { amount: number };

export class Requests {
  private agent: KwikPikHTTPsAgent;

  protected constructor(apiKey: string, environment: "dev" | "prod" = "prod") {
    this.agent = new KwikPikHTTPsAgent(apiKey, environment);
  }

  static initialize(apiKey: string, environment?: "dev" | "prod") {
    return new Requests(apiKey, environment);
  }

  public createDispatchRequests(requests: Array<Request>) {
    assert.ok(requests.length > 0, "invalid number of requests. must be > 0");

    forEach(requests, (request) => {
      const { error } = requestsSchema.validate(request);
      if (error) {
        const messages = error.details.map((e) => e.message);
        throw new Error(JSON.stringify(messages, undefined, 2));
      }
    });

    const path =
      requests.length > 1
        ? config.paths.requests.initialize_batch_requests
        : config.paths.requests.initialize_request;
    const data = requests.length > 1 ? { requests } : requests[0];
    return this.agent.createKwikPikSendableInstance<
      InitRequestResponse[] | InitRequestResponse
    >(path, "post", data);
  }
}
