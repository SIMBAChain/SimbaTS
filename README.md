# SimbaTS
TypeScript SDK for SIMBA Chain

# @simbachain/hardhat

Hardhat plugin for deploying smart contracts to the SIMBA Chain Blocks platform.

# Table of Contents:
1. [Summary](#summary)
2. [Testing](#testing)
3. [Integrating with Polyglot](#integrating-with-polyglot)


## Summary

SimbaTS is a standalone TypeScript SDK for SIMBA Chain. It contains functionality for interacting with the SIMBA platform in general, as well as for interacting with your smart contracts in particular. If you are using SimbaTS to interact with your deployed smart contracts, then we highly recommend you integrate with our Polyglot service, which we explain in this documentation.

### Testing
To run tests for SimbaTS, you'll want to have your SIMBA environment variables set in .simbachain.env at the top level of the /tests/ directory. So something like:

```
SIMBA_API_BASE_URL="https://simba-dev-api.platform.simbachain.com/"
SIMBA_AUTH_BASE_URL="https://simba-dev-api.platform.simbachain.com/"
SIMBA_AUTH_CLIENT_ID="Insert your client ID"
SIMBA_AUTH_CLIENT_SECRET="Insert your clietn secret"
```

Additionally, you can also configure SIMBATS_LOG_LEVEL, if you want tests to be run at a different log level. So if you want tests to be run at "debug" level, in .simbachain.env you would set:

```
SIMBATS_LOG_LEVEL="info"
```

## Integrating with Polyglot