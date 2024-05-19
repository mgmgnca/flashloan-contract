// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract IFlashloan {

    /**
     * @dev Represents a single hop (step) in a token swap route.
     * @param protocol A numeric identifier for the swap protocol (eg. Uniswap, Sushiswap).
     * @param data Arbitrary bytes data that may include additional parameters required by the protocol.
     * @param path An array of token addresses representing the swap path (tokenIn, intermediate tokens, tokenOut).
     */
    struct Hop {
        uint8 protocol;
        bytes data;
        address[] path;
    }

    /**
     * @dev Represents a route consisting of one or more hops for token swapping.
     * @param hops An array of `Hop` structs, each detailing a step in the swap process.
     * @param part A unit16 value representing the proportion of the total loan amount allocated to this route.
     */
    struct Route {
        Hop[] hops;
        uint16 part;
    }

    /**
     * @dev Struct for parameters required to initiate a flash loan.
     * @param flashLoanPool The address of the flash loan pool to borrow from.
     * @param loanAmount The total amount of tokens to borrow.
     * @param routes An array of `Route` structs defining the swap routes for the borrowed tokens.
     */
    struct FlashParams {
        address flashLoanPool;
        uint256 loanAmount;
        Route[] routes;
    }

    struct FlashCallbackData {
        address me;
        address flashLoanPool;
        uint256 loanAmount;
        Route[] routes;
    }

}