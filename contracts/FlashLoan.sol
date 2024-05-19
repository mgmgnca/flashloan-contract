// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./uniswap/IUniswapV2Router.sol";
import "./uniswap/v3/ISwapRouter.sol";

import "./interfaces/IFlashloan.sol";
import "./base/DodoBase.sol";
import "./interfaces/IDODOProxy.sol";

import "./base/FlashloanValidation.sol";
import "./base/Withdraw.sol";

import "./libraries/RouteUtils.sol";
import "./libraries/Part.sol";
import "hardhat/console.sol";

contract Flashloan is IFlashloan, DodoBase, FlashloanValidation, Withdraw {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    event SentProfit(address recipient, uint256 profit);
    event SwapFinished(address token, uint256 amount);


    function executeFlashloan(
        FlashParams memory params
    ) external checkParams(params) {
        
        bytes memory data = abi.encode(
            FlashCallbackData({
                me: msg.sender,
                flashLoanPool: params.flashLoanPool,
                loanAmount: params.loanAmount,
                routes: params.routes
            })
        );

        address loanToken = RouteUtils.getInitialToken(params.routes[0]);
        console.log(
            "CONTRACT BALANCE BEFORE BORROW",
            IERC20(loanToken).balanceOf(address(this))
        );

        // Identify the base token of the DODO pool.
        address btoken = IDODO(params.flashLoanPool)._BASE_TOKEN_();
        console.log(btoken, "BASE TOKEN");

        uint256 baseAmount = IDODO(params.flashLoanPool)._BASE_TOKEN_() == loanToken ? params.loanAmount :0;
        console.log(baseAmount, "baseAmount");

        uint256 quoteAmount = IDODO(params.flashLoanPool)._BASE_TOKEN_() == loanToken ? 0: params.loanAmount;
        console.log(quoteAmount, "quoteAmount");

        IDODO(params.flashLoanPool).flashLoan(
            baseAmount,
            quoteAmount,
            address(this),
            data
        );

    }

    function _flashLoanCallBack(
        address,
        uint256,
        uint256,
        bytes calldata data
    ) internal override {
        console.log("_flashLoanCallBack");
        // Decode the rece
        FlashCallbackData memory decoded = abi.decode(data, (FlashCallbackData));
        console.log("FlashParams decoded");
        // Identify the initial loan token from the decoded routes.
        // First Route, first Hop, first Path is loan token
        address loanToken = RouteUtils.getInitialToken(decoded.routes[0]);
        console.log("loanToken");

        // Ensure that the contract has received the loan amount
        require(IERC20(loanToken).balanceOf(address(this)) >= decoded.loanAmount, "Failed to borrow tokens");

        console.log(IERC20(loanToken).balanceOf(address(this)), "CONTRACT BALANCE AFTER BORROWING");

        // Execute the logic for routing the loan through different swaps.
        routeLoop(decoded.routes, decoded.loanAmount);

        console.log(
            "LOAN_TOKEN CONTRACT BALANCE AFTER BORROW AND SWAP",
            IERC20(loanToken).balanceOf(address(this))
        );

        emit SwapFinished(
            loanToken,
            IERC20(loanToken).balanceOf(address(this))
        );

        require(
            IERC20(loanToken).balanceOf(address(this)) >= decoded.loanAmount,
            "Not enough amount to return loan"
        );
        //Return funds
        IERC20(loanToken).transfer(decoded.flashLoanPool, decoded.loanAmount);

        console.log(
            "LOAN_TOKEN CONTRACT BALANCE AFTER REPAY",
            IERC20(loanToken).balanceOf(address(this))
        );

        // Transfer any remaining balance (profit) to the owner of the contract.


        // send all loanToken to msg.sender
        uint256 remained = IERC20(loanToken).balanceOf(address(this));
        // IERC20(loanToken).transfer(owner(), remained);
        // emit SentProfit(owner(), remained);
        IERC20(loanToken).transfer(decoded.me, remained);
        emit SentProfit(decoded.me, remained);

    }

    /**
     * @dev Iterate over an array of routes and executes swaps.
     * @param routes An array of Route structs, each definingg a swap path.
     * @param totalAmount the total amount of the loan to be distributed accross the routes.
     */
    function routeLoop(Route[] memory routes, uint256 totalAmount) internal checkTotalRoutePart(routes) {
        for (uint256 i = 0; i < routes.length; i++) {
            /**
             * Calculates the amount to be used in the current route based on its part of the total loan.
             * If routes[i].part is 10000 (100%), then the amount to be used is the total amount.
             * This helps if you want to use a percentage of the total amount for this swap and keep the rest for other purpose 
             * The partToAmountIn function form the Part libarary is used for this calculation.
             */
            uint256 amountIn = Part.partToAmountIn(routes[i].part, totalAmount);
            hopLoop(routes[i], amountIn);
        }

    }

    /**
     * @dev Processes a single route by iterating over eacch hop within the routs.
     *      Each hop represents a token swap operation using a specific protocol.
     * @param route The route struct representing a single route for token swaps.
     * @param totalAmount The amount of token to be swapped in this route.
     */
    function hopLoop(Route memory route, uint256 totalAmount) internal {
        uint256 amountIn = totalAmount;
        for (uint256 i = 0; i < route.hops.length; i++) {
            /**
             * Executes the token swap for the current hop and updates the amount for the next hop.
             * The pickProtocol function determines the specific protocol to use for the swap.
             */
            amountIn = pickProtocol(route.hops[i], amountIn);
        }
    }

    function pickProtocol(Hop memory hop, uint256 amountIn) internal returns (uint256 amountOut) {
        // Checks the protocol specified in the hop
        if (hop.protocol == 0) {
            /**
             * if the protocol is uniswap v3 (indicated by protocol number 0),
             * executes a swap using Uniswap V3's swap function.
             */
            amountOut = uniswapV3(hop.data, amountIn, hop.path);
            console.log(amountOut, "AMOUNT OUT RECEIVED FROM PROTOCOL ");
        } else if (hop.protocol < 8) {
            /**
             * if the protocol is uniswap v2 or similar (protocols 1-7),
             * executes a swap using uniswap v2's swap function
             */
            amountOut = uniswapV2(hop.data, amountIn, hop.path);
            console.log(amountOut, "AMOUNT OUT RECEIVED FROM PROTOCOL ");
        } else {
            /**
             * For other protocols (protocol number 8 and above),
             * executes a swap using DODO V2's swap function.
             */
            amountOut = dodoV2Swap(hop.data, amountIn, hop.path);
            console.log(amountOut, "AMOUNT OUT RECEIVED FROM PROTOCOL ");
        }
    }


    function uniswapV3(
        bytes memory data,
        uint256 amountIn,
        address[] memory path
    ) internal returns (uint256 amountOut) {
        (address router, uint24 fee) = abi.decode(data, (address, uint24));
        ISwapRouter swapRouter = ISwapRouter(router);
        approveToken(path[0], address(swapRouter), amountIn);

        // single swaps
        amountOut = swapRouter.exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: path[0],
                tokenOut: path[1],
                fee: fee,
                recipient: address(this),
                deadline: block.timestamp + 60,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            })
        );
    }


    function uniswapV2(
        bytes memory data,
        uint256 amountIn,
        address[] memory path
    ) internal returns (uint256 amountOut) {
        address router = abi.decode(data, (address));
        approveToken(path[0], router, amountIn);
        return
            IUniswapV2Router(router).swapExactTokensForTokens(
                amountIn,
                1,
                path,
                address(this),
                block.timestamp + 60
            )[1];
    }


    function dodoV2Swap(
        bytes memory data,
        uint256 amountIn,
        address[] memory path
    ) internal returns (uint256 amountOut) {
        (address dodoV2Pool, address dodoApprove, address dodoProxy) = abi
            .decode(data, (address, address, address));
        address[] memory dodoPairs = new address[](1); //one-hop
        dodoPairs[0] = dodoV2Pool;
        uint256 directions = IDODO(dodoV2Pool)._BASE_TOKEN_() == path[0]
            ? 0
            : 1;
        approveToken(path[0], dodoApprove, amountIn);
        amountOut = IDODOProxy(dodoProxy).dodoSwapV2TokenToToken(
            path[0],
            path[1],
            amountIn,
            1,
            dodoPairs,
            directions,
            false,
            block.timestamp
        );
    }

    function approveToken(
        address token,
        address to,
        uint256 amountIn
    ) internal {
        require(IERC20(token).approve(to, amountIn), "approve failed");
    }

}