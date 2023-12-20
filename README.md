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

To create new dispatch requests, utilize the `createDispatchRequest` function. It takes a request object as argument. It is important to take to mind that this doesn't mean the requests would be broadcasted to available riders. You'd have to pay for them first and then confirm them before they get broadcasted.

```javascript
// Removed for brevity sake

(async () => {
  const newRequest = await kwikpik.requests
    .createDispatchRequest({
      category: "Food",
      longitude: 3.623563,
      latitude: 6.4784693,
      destinationLongitude: 3.3252381,
      destinationLatitude: 6.513657500000001,
      product: "Rice & chicken",
      phoneNumber: "+2349066277540",
      recipientName: "Kingsley Marcus",
      recipientPhoneNumber: "+2348166691502",
      vehicleType: "motorcycle",
      senderName: "Thomas Aquinas"
    })
    .send();
})();
```

The `send` method returns a `Promise<InitRequestResponse>`. You can either await it or call `then`. The `InitRequestResponse` interface looks like this:

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
  senderName: string;
}

interface InitRequestResponse {
  id: string;
  data: RequestMessage;
  type: string;
  amount?: number;
}
```

#### Getting a single dispatch request

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

#### Confirming dispatch requests

Call the `confirmDispatchRequest` method to confirm dispatch requests. It takes a string (the request identifier) as argument.

```javascript
(async () => {
  const response = await requests
    .confirmDispatchRequest("9b1923cd-fc84-4a8a-b363-e11138891a43")
    .send();
})();
```

The `send` function returns a `Promise<ConfirmRequestResponse>`.

```typescript
interface ConfirmRequestResponse {
  id: string;
  data: string;
  type: string;
}
```

### Accounts

Utility class that is relevant to accounts.

#### Authenticating accounts

```javascript
// Removed for the sake brevity
(async () => {
  const account = await kwikpik.accounts.authenticate().call();
})();
```

The above code returns an `Promise<Account>`. The `Account` interface looks like this:

```typescript
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
```
