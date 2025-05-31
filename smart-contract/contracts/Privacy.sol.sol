// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PrivacyManager is Ownable, ReentrancyGuard {
    // Structs
    struct PrivacySettings {
        bool autoBlur;              // Whether to automatically blur faces
        bool requirePayment;        // Whether to require payment for commercial use
        uint256 price;              // Price in wei for commercial use
        uint256 lastUpdated;        // When settings were last updated
        string privacyLevel;        // Privacy level (e.g., "high", "medium", "low")
        bool allowDataSharing;      // Whether to allow data sharing with third parties
        uint256 dataRetentionDays;  // Number of days to retain data
    }

    // State variables
    mapping(address => PrivacySettings) private userSettings;
    mapping(address => bool) private authorizedUsers;
    mapping(address => uint256) private userBalances;
    
    // Events
    event SettingsUpdated(
        address indexed user, 
        bool autoBlur, 
        bool requirePayment, 
        uint256 price,
        string privacyLevel,
        bool allowDataSharing,
        uint256 dataRetentionDays
    );
    event UserAuthorized(address indexed user);
    event UserDeauthorized(address indexed user);
    event PaymentReceived(address indexed user, uint256 amount);
    event PaymentWithdrawn(address indexed user, uint256 amount);

    // Modifiers
    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    // Constructor
    constructor() Ownable(msg.sender) {
        // Initialize with default settings
        PrivacySettings memory defaultSettings = PrivacySettings({
            autoBlur: true,
            requirePayment: false,
            price: 0,
            lastUpdated: block.timestamp,
            privacyLevel: "high",
            allowDataSharing: false,
            dataRetentionDays: 30
        });
        userSettings[msg.sender] = defaultSettings;
    }

    // Privacy Settings Functions
    function updatePrivacySettings(
        bool _autoBlur,
        bool _requirePayment,
        uint256 _price,
        string memory _privacyLevel,
        bool _allowDataSharing,
        uint256 _dataRetentionDays
    ) external onlyAuthorized nonReentrant {
        require(_dataRetentionDays <= 365, "Data retention cannot exceed 365 days");
        
        PrivacySettings storage settings = userSettings[msg.sender];
        settings.autoBlur = _autoBlur;
        settings.requirePayment = _requirePayment;
        settings.price = _price;
        settings.lastUpdated = block.timestamp;
        settings.privacyLevel = _privacyLevel;
        settings.allowDataSharing = _allowDataSharing;
        settings.dataRetentionDays = _dataRetentionDays;
        
        emit SettingsUpdated(
            msg.sender, 
            _autoBlur, 
            _requirePayment, 
            _price,
            _privacyLevel,
            _allowDataSharing,
            _dataRetentionDays
        );
    }

    // Payment Functions
    function receivePayment() internal {
        require(msg.value > 0, "Payment amount must be greater than 0");
        userBalances[msg.sender] += msg.value;
        emit PaymentReceived(msg.sender, msg.value);
    }

    function withdrawPayment(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(_amount <= userBalances[msg.sender], "Insufficient balance");
        
        userBalances[msg.sender] -= _amount;
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit PaymentWithdrawn(msg.sender, _amount);
    }

    // Authorization Functions
    function authorizeUser(address _user) external onlyOwner {
        authorizedUsers[_user] = true;
        emit UserAuthorized(_user);
    }

    function deauthorizeUser(address _user) external onlyOwner {
        authorizedUsers[_user] = false;
        emit UserDeauthorized(_user);
    }

    // View Functions
    function getPrivacySettings(address _user)
        external
        view
        returns (
            bool autoBlur,
            bool requirePayment,
            uint256 price,
            uint256 lastUpdated,
            string memory privacyLevel,
            bool allowDataSharing,
            uint256 dataRetentionDays
        )
    {
        PrivacySettings memory settings = userSettings[_user];
        return (
            settings.autoBlur,
            settings.requirePayment,
            settings.price,
            settings.lastUpdated,
            settings.privacyLevel,
            settings.allowDataSharing,
            settings.dataRetentionDays
        );
    }

    function getBalance(address _user) external view returns (uint256) {
        return userBalances[_user];
    }

    function isAuthorized(address _user) external view returns (bool) {
        return authorizedUsers[_user] || _user == owner();
    }

    // Receive function to accept ETH
    receive() external payable {
        receivePayment();
    }
} 