// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title MessageBoard
/// @notice Simple on-chain message board with likes
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

    // Track which addresses liked a given message to prevent duplicate likes
    mapping(uint256 => mapping(address => bool)) private hasLiked;

    event MessageCreated(
        uint256 indexed id,
        address indexed author,
        string text,
        uint256 timestamp
    );

    /// @dev Emitted when a message is liked. Includes updated total likes.
    event MessageLiked(
        uint256 indexed id,
        address indexed liker,
        uint256 totalLikes
    );

    /// @notice Write a new message to the board
    /// @param _text The message text
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

    /// @notice Like a message by ID
    /// @dev Prevents liking your own message or liking the same message twice
    /// @param _id The message id to like
    function likeMessage(uint256 _id) external {
        require(_id > 0 && _id <= messageCount, "Invalid message");
        require(messages[_id].author != msg.sender, "Cannot like own message");
        require(!hasLiked[_id][msg.sender], "Already liked");

        messages[_id].likes += 1;
        hasLiked[_id][msg.sender] = true;

        emit MessageLiked(_id, msg.sender, messages[_id].likes);
    }

    /// @notice Returns a message by id
    /// @param _id The message id
    function getMessage(uint256 _id) external view returns (Message memory) {
        require(_id > 0 && _id <= messageCount, "Invalid message");
        return messages[_id];
    }

    /// @notice Check whether a user has liked a message
    /// @param _id The message id
    /// @param _user The user address
    /// @return whether the user has liked the message
    function hasUserLiked(uint256 _id, address _user) external view returns (bool) {
        require(_id > 0 && _id <= messageCount, "Invalid message");
        return hasLiked[_id][_user];
    }
}