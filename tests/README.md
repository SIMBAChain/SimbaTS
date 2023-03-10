# Table of Contents:
1. [Summary](#summary)
2. [Setup](#set-up)
3. [Running Tests](#running-tests)
4. [Hardhat Tests](#hardhat-tests)
5. [Truffle Tests](#truffle-tests)
6. [Tests With Coverage](#tests-with-coverage)

## Summary
We make heavy use of sinon stubs in these tests, as you'll see if you read through them. You'll also notice that we invoke 'callFakeMethod' quite a bit for our stubs. That function simply grabs the value for a given key from /tests/test_data/method_return_data.json. So if you want to add a new method and test to this repo, you can do an authentic call to get the expected result, then set that result in /tests/test_data/method_return_data.json.

## Set Up
There are proper integration tests in this suite of tests, so you will need to have your env file set with a few things.

So in tests/, your .simbachain.env file should look like:

```
SIMBA_API_BASE_URL=https://simba-dev-api.platform.simbachain.com/
SIMBA_AUTH_BASE_URL=https://simba-dev-api.platform.simbachain.com/
SIMBA_AUTH_CLIENT_ID<your ID for dev env>
SIMBA_AUTH_CLIENT_SECRET=<your secret for dev env>
SIMBA_AUTH_ENDPOINT="/o/"
SIMBATS_LOG_LEVEL="info"
```

And that's all you need for setup!

## Running Tests
You'll see references to "setup"/"with_setup" in these tests. These commands do not currently do anything, because we aren't manipulating files that need to be set/unset before and after tests. However, references to the functions remain here, in case we do want to implement setup and teardown in the future.

For the actual scripts / commands to run, you can read through package.json, under "scripts". To run any given test, from the root of this project, run from the terminal:

```
npm run <name of test>
```

So to run all tests, run

```
npm run all_test_with_setup
```

For integration tests, run

```
npm run integration_test_with_setup
```

For unit tests, run

```
npm run unit_test_with_setup
```