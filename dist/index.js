// src/index.ts
import fs from "fs";
import path from "path";
var shouldInclude = (name, config) => {
  if (config.excludes) {
    for (const exclude of config.excludes) {
      if (exclude.test(name)) {
        return false;
      }
    }
  }
  if (config.includes) {
    for (const include of config.includes) {
      if (include.test(name)) {
        return true;
      }
    }
    return false;
  } else {
    return true;
  }
};
var shouldIncludeFile = (fileName, config) => {
  const networkName = path.basename(fileName, ".json");
  if (config.include_networks && config.include_networks.length > 0) {
    if (!config.include_networks.includes(networkName)) {
      return false;
    }
  }
  if (config.exclude_networks && config.exclude_networks.length > 0) {
    if (config.exclude_networks.includes(networkName)) {
      return false;
    }
  }
  return true;
};
var plugin = (config) => {
  return {
    name: "hardhat-deploy",
    contracts: () => {
      const files = fs.readdirSync(config.directory).filter((file) => shouldIncludeFile(file, config));
      const contracts = files.reduce(
        (acc, file) => {
          const filename = path.join(config.directory, file);
          const deployment = JSON.parse(
            fs.readFileSync(filename).toString()
          );
          const chainId = parseInt(deployment.chainId);
          Object.entries(deployment.contracts).forEach(
            ([name, { abi, address }]) => {
              if (shouldInclude(name, config)) {
                const contract = acc[name] || {
                  name,
                  abi,
                  address: {}
                };
                const addresses = contract.address;
                addresses[chainId] = address;
                acc[name] = contract;
              }
            }
          );
          return acc;
        },
        {}
      );
      Object.values(contracts).forEach((contract) => {
        const addresses = Object.values(
          contract.address
        );
        const unique = [...new Set(addresses)];
        contract.address = unique.length === 1 ? unique[0] : contract.address;
      });
      return Object.values(contracts);
    }
  };
};
var src_default = plugin;
export {
  src_default as default
};
//# sourceMappingURL=index.js.map