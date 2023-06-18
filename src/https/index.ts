import axios, { AxiosInstance } from "axios";
import { assign } from "lodash";
import config from "../config.json";

interface KwikPikGenericResponse<T> {
  result: T;
}

export class KwikPikSendableHTTPsService<T> {
  /**
   * Whether this is a 'post' or 'patch' request
   */
  sendableType: "post" | "patch";

  /**
   * Url path
   */
  path: string;

  /**
   *  The https agent used in executing the request.
   */
  agent: AxiosInstance;

  /**
   *  The request body
   */
  body: any;

  constructor(
    path: string,
    agent: AxiosInstance,
    body: any,
    sendableType: "post" | "patch" = "post"
  ) {
    this.path = path;
    this.agent = agent;
    this.body = body;
    this.sendableType = sendableType;
  }

  send() {
    return this.sendableType === "post"
      ? this.agent
          .post<KwikPikGenericResponse<T>>(this.path, this.body)
          .then((resp) => resp.data.result)
      : this.agent
          .patch<KwikPikGenericResponse<T>>(this.path, this.body)
          .then((resp) => resp.data.result);
  }
}

export class KwikPikCallableHTTPsService<T> {
  /**
   * Whether this is a 'post' or 'patch' request
   */
  callableType: "get" | "delete";

  /**
   * Url path
   */
  path: string;

  /**
   *  The https agent used in executing the request.
   */
  agent: AxiosInstance;

  constructor(
    path: string,
    agent: AxiosInstance,
    callableType: "get" | "delete" = "get"
  ) {
    this.path = path;
    this.agent = agent;
    this.callableType = callableType;
  }

  call() {
    return this.callableType === "get"
      ? this.agent
          .get<KwikPikGenericResponse<T>>(this.path)
          .then((resp) => resp.data.result)
      : this.agent
          .delete<KwikPikGenericResponse<T>>(this.path)
          .then((resp) => resp.data.result);
  }
}

export class KwikPikHTTPsAgent {
  private axiosInstance: AxiosInstance;

  constructor(apiKey: string, environment: "dev" | "prod" = "prod") {
    const baseURL =
      environment === "prod" ? config.baseProdUrl : config.baseDevUrl;
    let headers = {};
    let axiosConfig = {};

    headers = assign(headers, { Authorization: `X-API-Key ${apiKey}` });
    axiosConfig = assign(axiosConfig, { baseURL, headers });
    this.axiosInstance = axios.create(axiosConfig);
  }

  public createKwikPikSendableInstance<T>(
    path: string,
    sendableType: "post" | "patch",
    body: any
  ) {
    return new KwikPikSendableHTTPsService<T>(
      path,
      this.axiosInstance,
      body,
      sendableType
    );
  }

  public createKwikPikCallableInstance<T>(
    path: string,
    callableType: "get" | "delete"
  ) {
    return new KwikPikCallableHTTPsService<T>(
      path,
      this.axiosInstance,
      callableType
    );
  }
}
