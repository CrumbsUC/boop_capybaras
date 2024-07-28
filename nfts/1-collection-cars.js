import {connectSdk}  from "./connect-sdk.js";

const createCollection = async () => {
  const {account, sdk} = await connectSdk();

  // 1. Let's check account's balance
  // NOTICE: get OPL tokens https://t.me/unique2faucet_opal_bot
  const balance = await sdk.balance.get(account);
  console.log(`${account.address} balance:`, balance.availableBalance.formatted);

  // 2. Mint collection
  const {parsed} = await sdk.collection.createV2({
    name: "Capybara Collection",
    description: "Your favorite gaming moments from the hit game Capybara Capture!",
    symbol: "CCC",
    cover_image: {url: "https://i.imgur.com/eojZdyZ.png"},
    // NOTICE: activate nesting for collection admin in order to assign achievements
    permissions: {nesting: {collectionAdmin: true}},
    encodeOptions: {
      overwriteTPPs: [
        {
          // tokenData is a container for attributes
          key: 'tokenData',
          permission: {
            // NOTICE: limit mutability for admins only 
            collectionAdmin: true, tokenOwner: false, mutable: true
          }
        }
      ],
    },
  });

  if(!parsed) throw Error('Cannot parse minted collection');
  
  console.log("JSKJFBSLIEFSLIEFOISEFILSEF")
  const collectionId = parsed.collectionId;
  console.log('Collection ID:', collectionId);
  console.log(`Explore your collection: https://uniquescan.io/opal/collections/${collectionId}`);

  process.exit(0);
}


createCollection().catch(e => {
  console.log('Something wrong during collection creation');
  throw e;
});

export {};