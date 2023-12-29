"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
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
  const networkName = import_path.default.basename(fileName, ".json");
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
      const files = import_fs.default.readdirSync(config.directory).filter((file) => shouldIncludeFile(file, config));
      const contracts = files.reduce(
        (acc, file) => {
          const filename = import_path.default.join(config.directory, file);
          const deployment = JSON.parse(
            import_fs.default.readFileSync(filename).toString()
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
//# sourceMappingURL=index.cjs.map