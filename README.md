# babelfish-dapp

## Configuration

All contract addresses should be added to `src/config` folder.

## Execution

Install dependencies with `yarn install`.

Run development server with `yarn dev`.

### Withdraw/Deposit config

All actual blockchain data is bring together in `src/config/bridges.ts`. You can find all token and bridge addresses that are used in `Agregator` page there. This is due to having few different instances of token that we display as the same one (ex. of `USDT`: we have one address on `ethMainnet`, one Sovryn's own rsk equivalent (`USDTes`), one on `BSC` and again Sovryn's rsk equivalent (`USDTbs`)). This approach helps to categorize them by network.
