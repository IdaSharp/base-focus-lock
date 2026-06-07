// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseFocusLock {
    mapping(address => uint256) public focusLocks;
    mapping(address => uint256) public lastLock;
    uint256 public totalLocks;

    event FocusLocked(address indexed user, uint256 timestamp, uint256 userLocks, uint256 totalLocks);

    function lockFocus() external {
        lastLock[msg.sender] = block.timestamp;

        unchecked {
            focusLocks[msg.sender] += 1;
            totalLocks += 1;
        }

        emit FocusLocked(msg.sender, block.timestamp, focusLocks[msg.sender], totalLocks);
    }
}
