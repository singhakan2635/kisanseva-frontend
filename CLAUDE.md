# KisanSeva Frontend - Engineering Standards

## You Are
A senior architect creating a production-ready, high-visibility project with **zero chance of error**. Every change must be thoroughly tested, reviewed, and validated before deployment.

## Project Overview

KisanSeva is an agriculture/farmer services platform that helps farmers identify plant diseases, deficiencies, and get treatment recommendations (mechanical, physical, and chemical) with probability scores.

### Infrastructure

| Component | Resource | URL |
|-----------|----------|-----|
| Backend repo | singhakan2635/kisanseva-backend | github.com |
| Frontend repo | singhakan2635/kisanseva-frontend | github.com |
| Backend Heroku | kisanseva-backend | https://kisanseva-backend-d6034e449591.herokuapp.com/ |
| Frontend Heroku | kisanseva-frontend | https://kisanseva-frontend-e6be1e269532.herokuapp.com/ |
| Database | kisanseva-db (separate DB, same Atlas cluster as Medigent) | MongoDB Atlas |

### Vision & Features (Target: Similar to Plantix/Agrio)
- **Plant Disease Detection**: Upload photo via app or WhatsApp, get accurate disease/deficiency diagnosis with probability scores
- **Treatment Recommendations**: Mechanical, physical, and chemical solutions for each detected issue
- **Sample Disease Images**: Show similar disease photos for farmer to confirm diagnosis
- **Farmer Profiles**: Custom profiles with plant/crop details
- **Comprehensive Database**: All pesticides, diseases, and deficiencies stored in backend for AI reference
- **Government Integration**: Integrate with https://vistaar.da.gov.in/ API for government schemes and data
- **Multi-language Support**: Using Sarvam AI (https://www.sarvam.ai/api-pricing) for Indian language support - critical for farmer accessibility
- **WhatsApp Bot**: Primary channel for farmers to interact (photo upload, get diagnosis, treatment advice)
- **Web/Mobile App**: Full-featured app with registration, WhatsApp number, farmer photo upload
- **Data Pipeline**: Scrape disease/pesticide data from existing apps and agricultural databases, then train models on that data

### Tech Stack
- **Frontend**: React 19 + Vite + Tailwind v4 (green/earth theme)
- **Auth**: Firebase (Phone OTP + Google OAuth) + JWT
- **i18n**: English + Hindi (i18next), Sarvam AI for additional Indian languages
- **Mobile**: Capacitor for Android/iOS builds
- **Icons**: Lucide React

## Engineering Rules

### CI/CD First
- Set up CI/CD pipeline BEFORE starting feature development
- Every PR must pass automated tests before merge
- Use GitHub Actions for CI (lint, type-check, test, build)

### Testing is Mandatory
- Always add tests for anything we deploy
- Unit tests with Vitest for components and utilities
- E2E tests with Playwright for critical user flows
- No PR merges without passing tests

### Deployment Protocol
- Always deploy to staging first, get approval before production
- Never change business logic without explicit permission
- Use feature branches, never push directly to main

### Code Quality
- TypeScript strict mode - no `any` types
- Tailwind v4 patterns: @theme tokens in index.css, no tailwind.config.js
- All API calls through services/api.ts apiClient wrapper
- Use @/ path alias for all imports
- Components in components/common/ must be reusable
- Role-based pages in pages/{farmer,expert,admin,team}/
- Lazy load all page components for code splitting

### Patterns
- Auth: AuthContext + useAuth hook
- Toast: ToastContext + useToast hook
- API: apiClient<T> with silent refresh and 401 handling
- Animations: --animate-* tokens in @theme
- Production server: server.js with security headers and SPA fallback
