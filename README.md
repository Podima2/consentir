# Privacy-Focused Face Detection with Payment System

A decentralized application that combines face detection technology with blockchain-based payments for privacy control. The application allows users to capture photos with automatic face blurring and provides an option to unblur faces through a payment system.

## Blockscout

https://worldchain-mainnet.explorer.alchemy.com/address/0x7FD7D4781690E5FC90910B83De93887B6EF84eA5?tab=contract

## Features

- **Face Detection & Blurring**
  - Real-time face detection using face-api.js
  - Automatic face blurring for privacy
  - Support for multiple faces in a single image
  - High-precision face recognition

- **Payment System**
  - Smart contract-based payment processing
  - ETH-based payments for unblurring faces
  - Secure transaction handling
  - Payment history tracking

- **Privacy Controls**
  - Configurable privacy settings
  - Automatic face blurring
  - Payment-based access control
  - Data retention management

- **User Interface**
  - Modern, responsive design
  - Camera controls with preview
  - Gallery for saved photos
  - Settings management
  - Payment dialog

## Smart Contract

The project uses a smart contract deployed at `0x7909Ac8F3a1C97f4812B9544Fa4D5620176b90b2` with the following main functions:

```solidity
function payFor(address to) public payable {
    require(msg.value > 0, "Must send some ETH");
    require(to != address(0), "Recipient cannot be zero address");
    userBalances[to] += msg.value;
    payments.push(Payment(msg.sender, to, msg.value));
    emit PaymentReceived(msg.sender, to, msg.value);
}
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or compatible Web3 wallet
- ETH for payments

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7909Ac8F3a1C97f4812B9544Fa4D5620176b90b2
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Usage

1. **Camera Access**
   - Click "Open Camera" to start the camera
   - Allow camera access when prompted

2. **Taking Photos**
   - Click "Take Photo" to capture an image
   - Faces will be automatically detected and blurred
   - The photo will be saved to the gallery

3. **Payment for Unblurring**
   - When faces are detected, a payment dialog appears
   - Enter the amount in ETH
   - Click "Pay" to process the payment
   - After successful payment, faces will be unblurred

4. **Settings**
   - Configure privacy settings
   - Set payment amounts
   - Manage data retention
   - Control face detection sensitivity

## Security Considerations

- Face data is processed locally and not stored
- Payments are handled through secure smart contracts
- User privacy settings are enforced on-chain
- No sensitive data is stored in the application


ngrok http http://localhost:3000