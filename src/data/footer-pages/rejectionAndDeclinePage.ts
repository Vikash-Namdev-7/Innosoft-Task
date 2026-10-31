
import type { FooterPageData } from "@/types"; 

export const rejectionAndDeclinePage: FooterPageData = {
  slug: "rejection-and-decline",
  label: "Rejection & Decline",
  badge: "KAILASHBOOK LEGAL",

  title: "Rejection & Decline Policy",

  subtitle:
    "When KailashBook may reject, decline, restrict, or reverse transactions, registrations, bonuses, or betting activity.",

  updatedOn: "02/04/2026",

  highlight:
    "This policy exists to protect compliance, fair usage, security, and the integrity of the platform.",

  intro: [
    "At KailashBook, we strive to provide a seamless and transparent gaming experience. In certain situations, we may need to reject, decline, or restrict transactions, accounts, or activities to ensure compliance, security, and fair usage.",

    "This page explains the most common reasons for rejection or decline across registration, verification, deposits, withdrawals, bonuses, bets, and account access.",
  ],

  summaryTitle: "QUICK SUMMARY",

  summaryBullets: [
    "Registration and KYC can be rejected if details are incomplete, fraudulent, or inconsistent.",

    "Deposits, withdrawals, bets, and bonuses may be held, reversed, or declined for risk or compliance reasons.",

    "Accounts can be suspended or closed when violations, fraud, or restricted-jurisdiction access is detected.",
  ],

  sections: [
    {
      title: "Account Registration Rejection",
      bullets: [
        "Incomplete or incorrect registration details.",
        "Duplicate or multiple account attempts.",
        "Suspicious or fraudulent activity.",
        "Failure to meet age or jurisdiction requirements.",
        "Use of VPN, proxy, or location masking tools.",
        "Previous account suspension or ban.",
      ],
    },

    {
      title: "KYC and Verification Rejection",
      description:
        "Verification may be declined when submitted documents are invalid, expired, unclear, mismatched, or not provided within the required timeframe.",
    },

    {
      title: "Deposit Rejection",
      bullets: [
        "Payment method is not registered in the user's name.",
        "Bank or payment provider rejection.",
        "Suspected fraudulent or unauthorized transactions.",
        "Chargeback history or risk flags.",
        "Violation of payment policies.",
      ],
    },

    {
      title: "Withdrawal Rejection",
      bullets: [
        "KYC verification is incomplete or pending.",
        "Suspicious account activity is detected.",
        "Bonus terms or wagering requirements are not fulfilled.",
        "Payment method mismatch.",
        "Breach of Terms and Conditions.",
      ],
    },

    {
      title: "Bonus and Promotion Rejection",
      bullets: [
        "Abuse or misuse of promotional offers.",
        "Multiple accounts used to claim bonuses.",
        "Violation of bonus terms.",
        "Fraudulent betting patterns.",
      ],
    },

    {
      title: "Bet Rejection or Cancellation",
      bullets: [
        "Incorrect odds or system errors.",
        "Technical malfunctions or disruptions.",
        "Suspicious or manipulative betting behavior.",
        "Bets placed after event start, when not allowed.",
        "Violation of fair play policies.",
      ],
    },

    {
      title: "Account Suspension or Closure",
      bullets: [
        "Violation of Terms and Conditions.",
        "Fraud, collusion, or illegal activity.",
        "Chargebacks or payment disputes.",
        "Abuse of platform features.",
        "Breach of responsible gaming policies.",
      ],
    },

    {
      title: "Restricted Jurisdictions and Risk Monitoring",
      description:
        "Users accessing KailashBook from restricted locations may face rejection, transaction blocking, or immediate suspension. The platform also monitors for fraud, money laundering risks, unusual betting patterns, and unauthorized access.",
    },

    {
      title: "Right to Refuse Service and Appeals",
      description:
        "KailashBook reserves the right to refuse service, reject transactions, or limit account functionality when necessary for security or compliance reasons. If you believe a rejection was made in error, contact support with the relevant details and documents for review.",
    },
  ],
};
