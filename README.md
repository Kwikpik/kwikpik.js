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

* Requests: For everything relevant to requests (creation, deletion & update).
* Accounts: For everything relevant to accounts (authentication, wallets, etc).

These classes can be imported directly and then initialized/instantiated or their instances can be accessed using the `initializeAPI` function which takes two arguments (one required and one optional) - an API key and an environment type (production or development).


```javascript
const { initializeAPI } = require("@kwikpik/kwikpik.js");
const kwikpik = initializeAPI("YOUR_API_KEY", "prod | dev");

kwikpik.requests // Requests instance
kwikpik.accounts // Accounts instance
```

### initializeAPI

This function takes one required and one optional argument and exposes the core APIs that can be utilized. 

_arguments:_

* **apiKey:** Your API key. This can be obtained from the business web app and is accessible only by businesses.

* **environment:** This can be either `dev` or `prod`. Use `dev` if you're acquainting yourself with the usage of the SDK as it leverages a development environment. Use `prod` when you're ready to use the SDK in a production environment.