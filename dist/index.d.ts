import { Plugin } from '@wagmi/cli';
import { Address, Abi } from 'abitype';

interface ContractExport {
    address: Address;
    abi: Abi;
    linkedData?: any;
}
interface Export {
    chainId: string;
    name: string;
    contracts: {
        [name: string]: ContractExport;
    };
}
interface HardhatDeployOptions {
    directory: string;
    includes?: RegExp[];
    excludes?: RegExp[];
    include_networks?: string[];
    exclude_networks?: string[];
}
declare const plugin: (config: HardhatDeployOptions) => Plugin;

export { ContractExport, Export, HardhatDeployOptions, plugin as default };
