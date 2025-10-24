# API Integration Directory

This directory contains all API integration logic for the SmartWallet PWA.

## Structure

```
lib/api/
├── client.ts          # API client configuration (axios/fetch)
├── endpoints.ts       # API endpoint definitions
├── types.ts           # API request/response types
├── auth/              # Authentication API calls
│   ├── login.ts
│   ├── register.ts
│   └── logout.ts
├── users/             # User management API calls
│   ├── getProfile.ts
│   ├── updateProfile.ts
│   ├── deleteAccount.ts
│   └── friends.ts
├── transactions/      # Transaction API calls
│   ├── getTransactions.ts
│   ├── createTransaction.ts
│   ├── updateTransaction.ts
│   └── deleteTransaction.ts
├── goals/             # Goals API calls
│   ├── getGoals.ts
│   ├── createGoal.ts
│   ├── updateGoal.ts
│   └── deleteGoal.ts
└── gamification/      # Gamification API calls
    ├── getAchievements.ts
    ├── getChallenges.ts
    └── getLeaderboard.ts
```

## Usage

Import API functions from their respective modules:

```typescript
import { login, register } from '@/lib/api/auth'
import { getProfile, updateProfile } from '@/lib/api/users'
import { getTransactions, createTransaction } from '@/lib/api/transactions'
```

All API calls should be wrapped in try-catch blocks and handle errors appropriately.
