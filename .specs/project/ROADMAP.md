# Roadmap

## Milestone 1: Foundation

- Align directory structure with `src/core`, `src/app`, and `src/infra`
- Finalize Prisma schema and migrations
- Add base repository and use-case contracts

## Milestone 2: Master Data

- Implement Client CRUD
- Implement Service CRUD
- Add search and pagination support

## Milestone 3: Order Management

- Implement order creation with at least one service
- Implement order status transitions
- Add order detail and status history views

## Milestone 4: Messaging and Scheduling

- Implement message templates
- Implement manual scheduling from order details
- Add automatic cancellation of pending schedules on terminal order states

## Milestone 5: Access Control

- Implement login and session handling
- Protect API routes and app pages

## Milestone 6: Hardening

- Add tests for domain and API behavior
- Review job processing and provider abstraction
- Fix remaining DX and operational gaps
