<p align="center"><img src="https://drive.google.com/uc?id=1RKi_LSKqBJfFQWKt_A8TC8BSono2dLhx&export=view" width="50%" height="200" alt="kwikpik" /></p>

# kwikpik.js

![npm](https://img.shields.io/npm/v/@kwikpik/kwikpik.js)
![npm](https://img.shields.io/npm/dt/@kwikpik/kwikpik.js)
![npm](https://img.shields.io/npm/l/@kwikpik/kwikpik.js)

## Introduction

`kwikpik.js` is a simple and convenient npm package that interfaces with Kwik-Pik's gateway and makes it possible to interact with business-relevant endpoints. If you aim to provide logistic services to customers without having to worry about configuration and code, and if you love Javascript, then this package is for you.

## Table of Content

1. [Installation](#installation)
2. [Overview & Usage](#overview--usage)

## Installation

The package can be installed using traditional package managers like `npm` and `yarn` like so:

```sh
npm install --save @kwikpik/kwikpik.js
```

or

```sh
yarn add @kwikpik/kwikpik.js
```

## Overview & Usage

The Kwikpik package provides access to the following classes:

- Requests: For everything relevant to requests (creation, deletion & update).
- Accounts: For everything relevant to accounts (authentication, wallets, etc).

These classes can be imported directly and then initialized/instantiated or their instances can be accessed using the `initializeAPI` function which takes two arguments (one required and one optional) - an API key and an environment type (production or development).

```javascript
const { initializeAPI } = require("@kwikpik/kwikpik.js");
const kwikpik = initializeAPI("YOUR_API_KEY", "prod | dev");

kwikpik.requests; // Requests instance
kwikpik.accounts; // Accounts instance
```

### initializeAPI

This function takes one required and one optional argument and exposes the core APIs that can be utilized.

_arguments:_

- **apiKey:** Your API key. This can be obtained from the business web app and is accessible only by businesses.

- **environment:** This can be either `dev` or `prod`. Use `dev` if you're acquainting yourself with the usage of the SDK as it leverages a development environment. Use `prod` when you're ready to use the SDK in a production environment.

### Requests

Utility class that provides functions that are relevant to dispatch requests. Each function returns a `KwikPikSendableHTTPsService` or `KwikPikCallableHTTPsService` class which exposes a `send` or `call` function which returns a Promise. You can await the Promise or "thenify" it.

#### Creating an instance of `Requests`

You can create an instance of Requests like so:

```javascript
const { Requests } = require("@kwikpik/kwikpik.js");

const requests = Requests.initialize("API_KEY", "prod | dev");
```

or you can access an already created instance:

```javascript
const { initializeAPI } = require("@kwikpik/kwikpik.js");
const kwikpik = initializeAPI("YOUR_API_KEY", "prod | dev");

kwikpik.requests; // Requests instance
```

#### Creating dispatch requests

To create new dispatch requests, utilize the `createDispatchRequests` function. It takes an array of requests as argument. It is important to take to mind that this doesn't mean the requests would be broadcasted to available riders. You'd have to pay for them first and then confirm them before they get broadcasted.

```javascript
// Removed for brevity sake

(async () => {
  const newRequest = await kwikpik.requests
    .createDispatchRequests([
      {
        category: "Food",
        longitude: 3.623563,
        latitude: 6.4784693,
        destinationLongitude: 3.3252381,
        destinationLatitude: 6.513657500000001,
        product: "Rice & chicken",
        phoneNumber: "+2349066277540",
        recipientName: "Kingsley Marcus",
        recipientPhoneNumber: "+2348166691502",
        vehicleType: "motorcycle"
      }
    ])
    .send();
})();
```

The `send` method returns a `Promise<InitRequestResponse | InitRequestResponse[]>`. You can either await it or call `then`. The `InitRequestResponse` interface looks like this:

```typescript
interface RequestMessage {
  location: {
    latitude: number;
    longitude: number;
  };
  userId: string;
  packageDetails: {
    category: string;
    product: string;
    description: string;
    weight: number | null;
    quantity: number;
    image: string;
    value: number | null;
  };
  selectedVehicleType:
    | "car"
    | "bus"
    | "bicycle"
    | "truck"
    | "van"
    | "motorcycle";
  userType: "BUSINESS" | "REGULAR_USER";
  destination: {
    latitude: number;
    longitude: number;
  };
  recipientPhoneNumber: string;
  recipientName: string;
  phoneNumber: string;
}

interface InitRequestResponse {
  id: string;
  data: RequestMessage;
  type: string;
  amount?: number;
}
```

#### Paying for dispatch requests

You can pay for dispatch requests by calling the `payForRequest` method of the `Accounts` class. This class is exposed by `initializeAPI`. The function takes a key-value pair object as argument. The keys to include in this object are `amount` which is how much you're paying for the request and `requestId` which is the unique identifier for the request. It returns a `KwikPikSendableHTTPsService` class

```javascript
// Removed for the sake of brevity
(async () => {
  const payment = await kwikpik.accounts
    .payForRequest({
      amount: 17520.20435673091,
      requestId: "9b1923cd-fc84-4a8a-b363-e11138891a43"
    })
    .send();
})();
```

Calling the `send` function of the returned class returns a `Promise<PaymentResponse>` which you can await or call `then` on. The `PaymentResponse` interface looks like this:

```typescript
interface PaymentResponse {
  id: string;
  amount: number;
  walletId: string;
  requestId: string;
  status: "PENDING" | "PAID";
  kind: "CRYPTO" | "FIAT";
  createdAt: string;
  updatedAt: string;
}
```

If you are uncertain with regard to how much to pay for a request, you can call the `getSingleRequest` function which returns a `KwikPikCallableHTTPsService` class like so:

```javascript
// Removed for the sake of brevity
(async () => {
  const request = await kwikpik.requests
    .getSingleRequest("6f705d48-4fda-4054-8f4d-6eb34b4161f1")
    .call();
})();
```

The `call` function returns a `Promise<SingleRequestResponse>`. The `SingleRequestResponse` interface looks like this:

```typescript
interface SingleRequestResponse extends RequestMessage {
  status:
    | "CANCELLED"
    | "DELIVERED"
    | "INIT_RIDE_REQUEST"
    | "CONFIRMED_RIDE_REQUEST";
  riderId: string | null;
  isInTransit: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  amount: number;
}
```

You can use the `amount` property in setting the value of the amount while paying for the request.

#### Confirming dispatch requests

Call the `confirmDispatchRequests` method to confirm dispatch requests. It takes an array of strings (request identifiers) as argument.

```javascript
(async () => {
  const response = await requests
    .confirmDispatchRequests(["9b1923cd-fc84-4a8a-b363-e11138891a43"])
    .send();
})();
```

The `send` function returns a `Promise<ConfirmRequestResponse[] | ConfirmRequestResponse>`.

```typescript
interface ConfirmRequestResponse {
  id: string;
  data: string;
  type: string;
}
```
