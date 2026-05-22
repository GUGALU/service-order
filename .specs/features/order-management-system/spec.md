# Order Management System Specification

## Problem Statement

Teams need a single system to manage clients, services, orders, and scheduled customer messaging without mixing business rules into the Next.js layer. The current workflow described by the requirements depends on reliable status transitions, soft-delete behavior, future-dated scheduling, and protected access.

## Goals

- [ ] Manage clients and services with search, pagination, and inactive state handling.
- [ ] Create and track orders through a strict lifecycle with totals and cancellation reasons.
- [ ] Support templated, scheduled messaging that can be processed asynchronously.
- [ ] Restrict access to authenticated users and keep all input validated at the API boundary.

## Out of Scope

Explicitly excluded for v1.

| Feature                                         | Reason                                  |
| ----------------------------------------------- | --------------------------------------- |
| Payments and invoicing                          | Not requested in the requirements       |
| Inventory management                            | Not part of the business scope          |
| Multi-tenant administration                     | No tenant model defined                 |
| Native mobile apps                              | Frontend scope is web/mobile-first only |
| Provider-specific WhatsApp/email implementation | Must stay behind generic interfaces     |

---

## User Stories

### P1: Client and Service Master Data ⭐ MVP

**User Story**: As an operator, I want to create, list, edit, search, paginate, and delete clients and services so that I can use them to open orders.

**Why P1**: Orders cannot exist without base client and service records.

**Acceptance Criteria**:

1. WHEN an operator creates a client THEN the system SHALL require a valid unique WhatsApp phone number.
2. WHEN an operator creates a service THEN the system SHALL require a base price and estimated execution time.
3. WHEN an operator deletes a client or service with existing order links THEN the system SHALL block the delete to preserve order history.
4. WHEN an operator searches the client or service list THEN the system SHALL support pagination and text filtering.

**Independent Test**: Can demo full CRUD for clients and services, including search, pagination, and delete behavior, without touching order flow.

---

### P1: Order Lifecycle Management ⭐ MVP

**User Story**: As an operator, I want to open orders for a client with one or more services and move them through a strict status lifecycle so that I can manage active work reliably.

**Why P1**: Orders are the core workflow of the system.

**Acceptance Criteria**:

1. WHEN an operator creates an order THEN the system SHALL require one client and at least one service.
2. WHEN an order is created THEN the system SHALL store the total as the sum of the selected service values at creation time.
3. WHEN an operator changes order status THEN the system SHALL allow only PENDING -> IN_PROGRESS -> COMPLETED or CANCELED transitions.
4. WHEN an operator cancels an order THEN the system SHALL require a cancellation reason.
5. WHEN an operator views an order THEN the system SHALL show details and the status change history.

**Independent Test**: Can demo creating an order, advancing its status, canceling it with a reason, and viewing history without involving messaging.

---

### P1: Messaging Templates and Scheduling ⭐ MVP

**User Story**: As an operator, I want to manage message templates and schedule messages for future execution so that customer communication can be standardized and deferred.

**Why P1**: Scheduled messaging is a primary product differentiator and must work asynchronously.

**Acceptance Criteria**:

1. WHEN an operator creates or edits a message template THEN the system SHALL allow standard dynamic tags such as `{{client_name}}`, `{{service_date}}`, `{{order_status}}`, and `{{order_total}}`.
2. WHEN an operator creates a schedule THEN the system SHALL reject dates and times that are not in the future.
3. WHEN an operator creates a schedule from an order detail view THEN the system SHALL persist it with a pending state.
4. WHEN an order changes to CANCELED or COMPLETED THEN the system SHALL automatically cancel any pending linked schedules.
5. WHEN a schedule is processed THEN the system SHALL record SENT or FAILED status.

**Independent Test**: Can demo creating templates, scheduling a future message, and observing that invalid or aborted schedules do not dispatch.

---

### P2: Automatic Follow-up Triggers

**User Story**: As an operator, I want configurable automatic triggers for follow-up messaging so that customer feedback or reminders can be scheduled after order events.

**Why P2**: Valuable automation, but the manual messaging flow is more important for first release.

**Acceptance Criteria**:

1. WHEN an order reaches COMPLETED THEN the system SHALL support creating a trigger that schedules a follow-up message after a configured delay.
2. WHEN a trigger is configured THEN the system SHALL use the same template and schedule rules as manual scheduling.
3. WHEN a trigger cannot be scheduled in the future THEN the system SHALL reject the request.

**Independent Test**: Can demo a completed-order trigger creating a deferred schedule without manually creating the schedule each time.

---

### P1: Authentication and Access Control ⭐ MVP

**User Story**: As an operator, I want to log in and keep my session protected so that only authenticated users can access the system.

**Why P1**: Protected access is a global system requirement.

**Acceptance Criteria**:

1. WHEN a user submits valid email and password credentials THEN the system SHALL create a secure authenticated session.
2. WHEN a user is not authenticated THEN the system SHALL block protected API routes and application pages.
3. WHEN a session is inactive for too long THEN the system SHALL expire it automatically.

**Independent Test**: Can demo login, access protection, and session expiration behavior without using order features.

---

## Edge Cases

- WHEN a client phone number is duplicated THEN the system SHALL reject the record.
- WHEN a service has been linked to orders THEN the system SHALL not hard delete it.
- WHEN an order has no services THEN the system SHALL reject creation.
- WHEN a schedule references a past date THEN the system SHALL reject creation.
- WHEN an order is completed or canceled THEN pending schedules linked to it SHALL be canceled immediately.
- WHEN a template is saved with unknown tags THEN the system SHOULD preserve the content and validate only the known standard tags.

---

## Requirement Traceability

| Requirement ID | Story                                  | Phase  | Status  |
| -------------- | -------------------------------------- | ------ | ------- |
| RN01           | P1: Client and Service Master Data     | Design | Pending |
| RN02           | P1: Client and Service Master Data     | Design | Pending |
| RN03           | P1: Client and Service Master Data     | Design | Pending |
| RN04           | P1: Order Lifecycle Management         | Design | Pending |
| RN05           | P1: Order Lifecycle Management         | Design | Pending |
| RN06           | P1: Order Lifecycle Management         | Design | Pending |
| RN07           | P1: Messaging Templates and Scheduling | Design | Pending |
| RN08           | P1: Messaging Templates and Scheduling | Design | Pending |
| RN09           | P1: Messaging Templates and Scheduling | Design | Pending |
| RF01           | P1: Client and Service Master Data     | Design | Pending |
| RF02           | P1: Client and Service Master Data     | Design | Pending |
| RF03           | P1: Client and Service Master Data     | Design | Pending |
| RF04           | P1: Order Lifecycle Management         | Design | Pending |
| RF05           | P1: Order Lifecycle Management         | Design | Pending |
| RF06           | P1: Order Lifecycle Management         | Design | Pending |
| RF07           | P1: Order Lifecycle Management         | Design | Pending |
| RF08           | P1: Messaging Templates and Scheduling | Design | Pending |
| RF09           | P1: Messaging Templates and Scheduling | Design | Pending |
| RF10           | P2: Automatic Follow-up Triggers       | Design | Pending |
| RF11           | P1: Messaging Templates and Scheduling | Design | Pending |
| RF12           | P1: Authentication and Access Control  | Design | Pending |
| RF13           | P1: Authentication and Access Control  | Design | Pending |
| RNF01          | P1: Client and Service Master Data     | Design | Pending |
| RNF02          | P1: Order Lifecycle Management         | Design | Pending |
| RNF03          | P1: Order Lifecycle Management         | Design | Pending |
| RNF04          | P1: Messaging Templates and Scheduling | Design | Pending |
| RNF05          | P1: Messaging Templates and Scheduling | Design | Pending |
| RNF06          | P1: Client and Service Master Data     | Design | Pending |
| RNF07          | P1: Client and Service Master Data     | Design | Pending |

**ID format:** existing business requirement identifiers are preserved for traceability.

**Status values:** Pending → In Design → In Tasks → Implementing → Verified

**Coverage:** 28 total, 28 mapped to stories, 0 unmapped

---

## Success Criteria

- [ ] A client, service, order, template, and schedule can each be created through the designed flows.
- [ ] Orders obey the declared lifecycle and cancellation rules.
- [ ] Pending schedules are never left active after terminal order states.
- [ ] Unauthenticated users cannot reach protected routes or actions.
- [ ] Every API input is validated before reaching domain logic.
