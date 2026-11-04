# babelfish-dapp

## Configuration

All contract addresses should be added to `src/config` folder.

## Execution

Install dependencies with `yarn install`.

Run development server with `yarn dev`.

### Withdraw/Deposit config

All actual blockchain data is bring together in `src/config/bridges.ts`. You can find all token and bridge addresses that are used in `Agregator` page there. This is due to having few different instances of token that we display as the same one (ex. of `USDT`: we have one address on `ethMainnet`, one Sovryn's own rsk equivalent (`USDTes`), one on `BSC` and again Sovryn's rsk equivalent (`USDTbs`)). This approach helps to categorize them by network.

### Releases

We show a link to the latest release (https://github.com/BabelFishProtocol/babelfish-dapp/releases/latest) in the footer. For this feature to work, every production release needs to be properly tagged at https://github.com/BabelFishProtocol/babelfish-dapp/releases.

## Maintenance deployment

The entry page currently shows maintenance on every app route without loading
application or wallet scripts. To build this static deployment without generating
the dormant app types, use the pinned Yarn version:

```sh
yarn install --immutable --mode=skip-build
yarn build:maintenance
```

Netlify uses the checked-in `netlify.toml` to build this maintenance version.
Push the maintenance branch and merge it into the production branch configured
in Netlify to publish through the existing Git integration.

You can also deploy the contents of `dist` to the existing app hosting project. Keep `_redirects`
in the deployment so direct links also show maintenance. The homepage is a
separate deployment. Restoring the application requires restoring its entry page, removing the
maintenance-specific Netlify configuration, and running the normal application
build.
