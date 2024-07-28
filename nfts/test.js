/*
import { MetamaskProvider } from '@unique-nft/accounts/metamask';

const provider = new MetamaskProvider();
await provider.init();

const signer = await provider.first();

const { parsed, error } = await sdk.collection.create.submitWaitResult({
    name: "aaaaaaaahelp",
    description: "My test collection",
    tokenPrefix: "TST",
  });
  
  if (error) throw Error("Error occurred while creating a collection");
  if (!parsed) throw Error("Cannot parse results");
  
  const { collectionId } = parsed;
  const collection = await sdk.collection.get({ collectionId });
  
  // Create NFT
  await sdk.token.create({ collectionId });
  // ...
  
*/