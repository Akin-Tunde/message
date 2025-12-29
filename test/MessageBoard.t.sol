// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/MessageBoard.sol";

contract MessageBoardTest is Test {
    MessageBoard mb;
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        mb = new MessageBoard();
    }

    function testWriteMessageCreatesMessage() public {
        vm.prank(alice);
        mb.writeMessage("Hello");

        (uint256 id, address author, string memory text, uint256 likes, uint256 timestamp) = mb.getMessage(1);

        assertEq(id, 1);
        assertEq(author, alice);
        assertEq(text, "Hello");
        assertEq(likes, 0);
        assertTrue(timestamp > 0);
    }

    function testCannotLikeOwnMessage() public {
        vm.prank(alice);
        mb.writeMessage("Selfie");

        vm.prank(alice);
        vm.expectRevert(bytes("Cannot like own message"));
        mb.likeMessage(1);
    }

    function testCannotLikeTwice() public {
        vm.prank(alice);
        mb.writeMessage("Hello again");

        vm.prank(bob);
        mb.likeMessage(1);

        vm.prank(bob);
        vm.expectRevert(bytes("Already liked"));
        mb.likeMessage(1);
    }

    function testLikeIncrementsAndEmits() public {
        vm.prank(alice);
        mb.writeMessage("Post");

        vm.prank(bob);
        vm.expectEmit(true, true, false, true);
        emit MessageLikedExpected(1, bob, 1);
        mb.likeMessage(1);

        (, , , uint256 likes, ) = mb.getMessage(1);
        assertEq(likes, 1);

        bool liked = mb.hasUserLiked(1, bob);
        assertTrue(liked);
    }

    // Helper to assert the MessageLiked event signature
    event MessageLikedExpected(uint256 indexed id, address indexed liker, uint256 totalLikes);

    function testInvalidIdRevertsOnLikeAndGet() public {
        vm.expectRevert(bytes("Invalid message"));
        mb.likeMessage(999);

        vm.expectRevert(bytes("Invalid message"));
        mb.getMessage(999);
    }
}
