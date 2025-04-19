// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SocietyFactory is Ownable {
    struct Society {
        string name;
        string description;
        string imageURI;
        address creator;
        uint256 createdAt;
        bool isActive;
    }

    struct Event {
        uint256 societyId;
        string name;
        string description;
        string imageURI;
        uint256 startTime;
        uint256 endTime;
        uint256 createdAt;
        bool isActive;
    }

    struct Participant {
        address userAddress;
        uint256 joinedAt;
    }

    // Storage
    Society[] public societies;
    mapping(uint256 => Event[]) public societyEvents;
    mapping(uint256 => mapping(uint256 => Participant[])) public eventParticipants;
    mapping(address => bool) public admins;

    // Events
    event SocietyCreated(uint256 indexed societyId, string name, address creator);
    event SocietyUpdated(uint256 indexed societyId, string name);
    event SocietyStatusChanged(uint256 indexed societyId, bool isActive);
    
    event EventCreated(uint256 indexed societyId, uint256 indexed eventId, string name);
    event EventUpdated(uint256 indexed societyId, uint256 indexed eventId, string name);
    event EventStatusChanged(uint256 indexed societyId, uint256 indexed eventId, bool isActive);
    
    event UserJoinedEvent(uint256 indexed societyId, uint256 indexed eventId, address user);

    constructor() Ownable(msg.sender) {
        admins[msg.sender] = true;
    }

    // Modifiers
    modifier onlyAdmin() {
        require(admins[msg.sender] || owner() == msg.sender, "Not authorized");
        _;
    }

    modifier societyExists(uint256 societyId) {
        require(societyId < societies.length, "Society does not exist");
        _;
    }

    modifier eventExists(uint256 societyId, uint256 eventId) {
        require(eventId < societyEvents[societyId].length, "Event does not exist");
        _;
    }

    // Admin functions
    function addAdmin(address admin) external onlyOwner {
        admins[admin] = true;
    }

    function removeAdmin(address admin) external onlyOwner {
        admins[admin] = false;
    }

    // Society functions
    function createSociety(
        string memory name,
        string memory description,
        string memory imageURI
    ) external onlyAdmin returns (uint256) {
        uint256 societyId = societies.length;
        
        societies.push(
            Society({
                name: name,
                description: description,
                imageURI: imageURI,
                creator: msg.sender,
                createdAt: block.timestamp,
                isActive: true
            })
        );
        
        emit SocietyCreated(societyId, name, msg.sender);
        return societyId;
    }

    function updateSociety(
        uint256 societyId,
        string memory name,
        string memory description,
        string memory imageURI
    ) external onlyAdmin societyExists(societyId) {
        Society storage society = societies[societyId];
        society.name = name;
        society.description = description;
        society.imageURI = imageURI;
        
        emit SocietyUpdated(societyId, name);
    }

    function toggleSocietyStatus(uint256 societyId) external onlyAdmin societyExists(societyId) {
        societies[societyId].isActive = !societies[societyId].isActive;
        emit SocietyStatusChanged(societyId, societies[societyId].isActive);
    }

    // Event functions
    function createEvent(
        uint256 societyId,
        string memory name,
        string memory description,
        string memory imageURI,
        uint256 startTime,
        uint256 endTime
    ) external onlyAdmin societyExists(societyId) returns (uint256) {
        require(startTime > block.timestamp, "Start time must be in the future");
        require(endTime > startTime, "End time must be after start time");
        
        uint256 eventId = societyEvents[societyId].length;
        
        societyEvents[societyId].push(
            Event({
                societyId: societyId,
                name: name,
                description: description,
                imageURI: imageURI,
                startTime: startTime,
                endTime: endTime,
                createdAt: block.timestamp,
                isActive: true
            })
        );
        
        emit EventCreated(societyId, eventId, name);
        return eventId;
    }

    function updateEvent(
        uint256 societyId,
        uint256 eventId,
        string memory name,
        string memory description,
        string memory imageURI,
        uint256 startTime,
        uint256 endTime
    ) external onlyAdmin societyExists(societyId) eventExists(societyId, eventId) {
        Event storage event_ = societyEvents[societyId][eventId];
        
        event_.name = name;
        event_.description = description;
        event_.imageURI = imageURI;
        event_.startTime = startTime;
        event_.endTime = endTime;
        
        emit EventUpdated(societyId, eventId, name);
    }

    function toggleEventStatus(uint256 societyId, uint256 eventId) 
        external 
        onlyAdmin 
        societyExists(societyId) 
        eventExists(societyId, eventId) 
    {
        societyEvents[societyId][eventId].isActive = !societyEvents[societyId][eventId].isActive;
        emit EventStatusChanged(societyId, eventId, societyEvents[societyId][eventId].isActive);
    }

    // Participant functions
    function joinEvent(uint256 societyId, uint256 eventId) 
        external 
        societyExists(societyId) 
        eventExists(societyId, eventId) 
    {
        Event memory event_ = societyEvents[societyId][eventId];
        require(event_.isActive, "Event is not active");
        require(block.timestamp < event_.endTime, "Event has ended");
        
        // Check if user already joined
        Participant[] storage participants = eventParticipants[societyId][eventId];
        for (uint i = 0; i < participants.length; i++) {
            if (participants[i].userAddress == msg.sender) {
                revert("Already joined this event");
            }
        }
        
        participants.push(Participant({
            userAddress: msg.sender,
            joinedAt: block.timestamp
        }));
        
        emit UserJoinedEvent(societyId, eventId, msg.sender);
    }

    // View functions
    function getSocietyCount() external view returns (uint256) {
        return societies.length;
    }

    function getEventCount(uint256 societyId) external view societyExists(societyId) returns (uint256) {
        return societyEvents[societyId].length;
    }

    function getParticipantCount(uint256 societyId, uint256 eventId) 
        external 
        view 
        societyExists(societyId) 
        eventExists(societyId, eventId) 
        returns (uint256) 
    {
        return eventParticipants[societyId][eventId].length;
    }

    function getParticipants(uint256 societyId, uint256 eventId) 
        external 
        view 
        societyExists(societyId) 
        eventExists(societyId, eventId) 
        returns (Participant[] memory) 
    {
        return eventParticipants[societyId][eventId];
    }

    function getAllSocieties() external view returns (Society[] memory) {
        return societies;
    }

    function getSocietyEvents(uint256 societyId) 
        external 
        view 
        societyExists(societyId) 
        returns (Event[] memory) 
    {
        return societyEvents[societyId];
    }

    function isUserParticipant(uint256 societyId, uint256 eventId, address user) 
        external 
        view 
        societyExists(societyId) 
        eventExists(societyId, eventId) 
        returns (bool) 
    {
        Participant[] storage participants = eventParticipants[societyId][eventId];
        for (uint i = 0; i < participants.length; i++) {
            if (participants[i].userAddress == user) {
                return true;
            }
        }
        return false;
    }
}
