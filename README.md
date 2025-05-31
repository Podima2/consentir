# Privacy-Focused Face Detection with Payment System

A decentralized application that combines face detection technology with blockchain-based payments for privacy control. The application allows users to capture photos with automatic face blurring and provides an option to unblur faces through a payment system.

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

## Technical Stack

- **Frontend**
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - face-api.js

- **Blockchain**
  - Ethereum
  - Smart Contracts
  - Web3.js
  - MiniKit

## Security Considerations

- Face data is processed locally and not stored
- Payments are handled through secure smart contracts
- User privacy settings are enforced on-chain
- No sensitive data is stored in the application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- face-api.js for face detection capabilities
- OpenZeppelin for smart contract security
- MiniKit for blockchain integration
- The Ethereum community for blockchain infrastructure

## World ID Verification Setup

This application uses World ID verification via the Worldcoin Mini App. To set it up:

1. Create an account on the [Worldcoin Developer Portal](https://developer.worldcoin.org/)
2. Create a new App in the Developer Portal
3. Create a new "Incognito Action" within your app for the verification
   - Incognito Actions are a primitive of World ID and allow you to gate functionality behind a unique human check
   - You can limit the number of times a user can perform an action
4. Copy your app ID and update the `.env.local` file:
   ```
   NEXT_PUBLIC_WLD_APP_ID="app_YOUR_MINI_APP_ID_HERE"
   NEXT_PUBLIC_WLD_ACTION_ID="tute-claim-action" # Or your custom action ID
   ```
5. Make sure you have the World App installed on your device to test the verification flow

### Implementation Details

The verification flow is triggered when clicking the "Verify to Claim" button, which will:

1. Open the World App for verification
2. Prompt the user to confirm the verification
3. Send the proof to the backend for verification
4. Upon successful verification, allow the user to claim TUTE tokens

#### Event-Based Approach

This implementation uses the event-based approach as recommended in the World ID documentation:

1. We use `MiniKit.commands.verify()` instead of the async version to initiate the verification
2. Event listeners are set up to handle the verification result:
   ```javascript
   document.addEventListener("miniapp-verify-action-success", handleSuccess);
   document.addEventListener("miniapp-verify-action-error", handleError);
   ```
3. When a successful verification event is received, we then verify the proof on the backend

This follows the exact implementation guidelines from the [World ID Verify Command documentation](https://docs.world.org/mini-apps/commands/verify).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn more about World ID and Mini Apps:

- [World ID Documentation](https://docs.world.org/)
- [Mini Apps Quick Start](https://docs.world.org/mini-apps/quick-start)
- [Verify Command Documentation](https://docs.world.org/mini-apps/commands/verify)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


ngrok http http://localhost:3000