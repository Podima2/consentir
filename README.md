Readme 
![Consentoi](https://github.com/user-attachments/assets/c98beb81-65db-4cfc-a7d0-a03fe92aa7fb)"

<p align="center">
  <a href="https://www.linkedin.com/in/agustin-schiariti/">
    <img src="https://img.shields.io/badge/Reach_Agustin-On_LinkedIn-Green">
  </a>
</p>

<p align="center">
  <a href="## ✨ Overview"> Overview </a> •
  <a href="## Quick Links"> Quick Links </a> •
  <a href="## Smart Contract"> Smart Contract</a> •  
  <a href="## 💡 The Problem: Losing Control in a Captured World"> The Problem </a> •
  <a href="## 🚀 The Solution: Proactive Agency & Decentralized Consent"> The Solution </a> •
  <a href="## ✨ Key Features (MVP)"> Key Features </a> •

  
</p>

## ✨ Overview

In an era of ubiquitous cameras, smart glasses, and the looming threat of "100% memory humans," our visual identity is constantly captured, often without our consent or knowledge. **Consentoi** is a pioneering World App mini-app designed to restore **personal image agency** to the individual.

We envision a future where your digital image rights are enhanced, enabling you to define greater defined terms of capture, blurring, and even monetization. Our MVP demonstrates a revolutionary privacy layer that empowers users to proactively manage their presence in others' recordings.

---
## Quick Links
 - presentation - https://www.canva.com/design/DAGovrEJrTY/wgl4rlSomjuUV3QqDKVJWQ/edit?utm_content=DAGovrEJrTY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

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

## Blockscout

https://worldchain-mainnet.explorer.alchemy.com/address/0x7FD7D4781690E5FC90910B83De93887B6EF84eA5?tab=contract


## 💡 The Problem: Losing Control in a Captured World

We stand at an inflection point. The proliferation of recording devices means every public moment can be immortalized and distributed. This unchecked capture leads to:

* **Loss of Consent & Agency:** Our faces become public property, used, shared, and analyzed without our knowledge or explicit permission.
* **Weaponization of Identity:** An innocent background appearance can be harvested to create **hyper-realistic deepfakes**, capable of damaging reputations, spreading misinformation, and stealing our very identity.
* **Governmental & Corporate Lag:** While the stakes are immense (e.g., only Chile has legislated neuro-rights), governments are slow to react. Meanwhile, tech giants unilaterally dictate terms (like Meta's insufficient blinking light), steamrolling over fundamental digital freedoms.

**We need a solution that empowers individuals to communicate their terms before capture, rather than relying on reactive measures.**

## 🚀 The Solution: Proactive Agency & Decentralized Consent

**Consentoi** tackles this head-on by giving individuals the power to manage their image directly. Our MVP focuses on a multi-faceted solution:

1.  **On-Device, Real-time Blurring:** If another user of Consentoi records you, your face is automatically detected and blurred *on their device*, *before* the video is even saved. This protects your privacy at the source.
2.  **User-Defined Privacy Preferences:** You set your rules. Through your World ID, you broadcast your explicit preferences for how your image should be handled (e.g., always blur, or require consent/payment for commercial use).
3.  **Decentralized Consent & Monetization:** For commercial scenarios, if both parties have verified World IDs, our app enables a secure, on-chain transaction. You can set a compensation rate for the commercial use of your unblurred image, with the transaction facilitated by blockchain technology.

## ✨ Key Features (MVP)

* **World ID-Gated Access:** Mandatory World ID verification for full app access, ensuring authenticated identity for all users.
* **Face Detection & Blurring**
  - Real-time face detection using face-api.js
  - Automatic face blurring for privacy
  - Support for multiple faces in a single image
  - High-precision face recognition
* **Payment System**
  - Smart contract-based payment processing
  - ETH-based payments for unblurring faces
  - Secure transaction handling
  - Payment history tracking
* **Privacy Controls**
  - Configurable privacy settings
  - Automatic face blurring
  - Payment-based access control
  - Data retention management
* **Secure Unblurring Process:** Upon successful payment, the recorder's app is allowed to display/save the unblurred image.
* **Local Storage of Blurred Content:** Your own recordings (with applied privacy settings) are saved directly to your device's native gallery.


## 🤝 Why We Chose Worldcoin

Our project is a natural synergy with the core missions of our hackathon sponsor:

* **Worldcoin:** We empower true **digital agency** by making **verifiable personhood (World ID)** the foundation of personal image control. World ID is essential for securely linking users to their preferences and facilitating consent-based, monetized interactions without relying on centralized authorities.

## Security Considerations

- Face data is processed locally and not stored
- Payments are handled through secure smart contracts
- User privacy settings are enforced on-chain
- No sensitive data is stored in the application

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


---
> LinkedIn [Agustin](https://www.linkedin.com/in/agustin-schiariti/) &nbsp;&middot;&nbsp;
> GitHub [@Podima2](https://github.com/Podima2) &nbsp;&middot;&nbsp;
> Twitter [@The_Game_2030](https://twitter.com/The_Game_2030)
