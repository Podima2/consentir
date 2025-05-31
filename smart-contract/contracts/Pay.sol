// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PayAndWithdraw {
    // Track how much ETH each user has received (stored in contract)
    mapping(address => uint256) public userBalances;

    struct Payment {
        address from;
        address to;
        uint256 amount;
    }

    Payment[] public payments;

    event PaymentReceived(address indexed from, address indexed to, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    /// @notice Send ETH to another user (stores it in contract for them)
    function payFor(address to) public payable {
        require(msg.value > 0, "Must send some ETH");
        require(to != address(0), "Recipient cannot be zero address");

        userBalances[to] += msg.value;
        payments.push(Payment(msg.sender, to, msg.value));

        emit PaymentReceived(msg.sender, to, msg.value);
    }

    /// @notice Allows the recipient to withdraw their stored balance
    function withdraw() public {
        uint256 amount = userBalances[msg.sender];
        require(amount > 0, "No balance to withdraw");

        // Effects before interaction (prevents reentrancy)
        userBalances[msg.sender] = 0;

        // Transfer ETH to the recipient
        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, amount);
    }

    /// Optional: check how many total payments were made
    function getTotalPayments() public view returns (uint256) {
        return payments.length;
    }

    /// Optional: view individual payment
    function getPayment(uint256 index) public view returns (address from, address to, uint256 amount) {
        Payment memory p = payments[index];
        return (p.from, p.to, p.amount);
    }
}
