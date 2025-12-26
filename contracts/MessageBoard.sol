// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MessageBoard {
    struct Message {
        uint256 id;
        address author;
        string text;
        uint256 likes;
        uint256 timestamp;
    }

    uint256 public messageCount;
    mapping(uint256 => Message) public messages;

    event MessageCreated(
        uint256 indexed id,
        address indexed author,
        string text,
        uint256 timestamp
    );

    event MessageLiked(
        uint256 indexed id,
        address indexed liker
    );

    function writeMessage(string calldata _text) external {
        require(bytes(_text).length > 0, "Empty message");

        messageCount++;

        messages[messageCount] = Message({
            id: messageCount,
            author: msg.sender,
            text: _text,
            likes: 0,
            timestamp: block.timestamp
        });

        emit MessageCreated(
            messageCount,
            msg.sender,
            _text,
            block.timestamp
        );
    }

    function likeMessage(uint256 _id) external {
        require(_id > 0 && _id <= messageCount, "Invalid message");
        messages[_id].likes += 1;
        emit MessageLiked(_id, msg.sender);
    }

    function getMessage(uint256 _id) external view returns (Message memory) {
        return messages[_id];
    }
}