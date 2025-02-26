# AITable Database Documentation

Last updated: 2025-02-26T19:30:57.882Z

Space ID: spc12q5HY4ay5

## Overview

This database is organized into several functional areas, each managed by dedicated folders:

1. Project Management - Core project tracking and task management
2. Projects Related - Project-specific activities and reports
3. Team - Team structure and member management
4. Financials - Financial tracking, payments, and reporting
5. Leadgen - Lead generation and CRM activities
6. CRM - Customer relationship management
7. PPC News - YouTube and advertising related content
8. Niche related - Niche-specific data

## Table Structure by Area

### 1. Project Management
Located in "Project Management" folder (`fodFcGP6CDpjT`)

#### Task Table
- **ID**: `dstfwotDvyhRtriDRv`
- **Icon**: 📍
- **Purpose**: Track individual tasks and activities

#### Project Table
- **ID**: `dstn0BiddWUmMqCvsB`
- **Icon**: 💼
- **Purpose**: Project management and tracking

### 2. Projects Related
Located in "ProjectsRelated" folder (`fodJWKErpqdKB`)

#### ClientCalls Table
- **ID**: `dstsdypzYzmT0cjaEJ`
- **Icon**: 🎥
- **Purpose**: Track client communications and meetings

#### ProjectReports Table
- **ID**: `dstUEbWw5AD1tEPoPE`
- **Purpose**: Store project reports and documentation

### 3. Team Management
Located in "Team" folder (`fodh5ZssfVzSa`)

#### Teams Table
- **ID**: `dstCv7Y9Hkhf4AQcDA`
- **Icon**: 👥
- **Purpose**: Team organization and structure

#### Members Table
- **ID**: `dstEn1hH4TxaEoEC0W`
- **Icon**: 👷‍♂️
- **Purpose**: Individual team member information

#### Services Table
- **ID**: `dstFrV4py2zW3yFFGg`
- **Icon**: 🛎️
- **Purpose**: Service offerings and capabilities

### 4. Financial Management
Located in "Financials" folder (`fodyrUdjo9hKz`)

#### Payments Table
- **ID**: `dst6yHG1gcUHquvMD0`
- **Purpose**: Track payments and financial transactions

#### Subscriptions Table
- **ID**: `dst93iSE1ToDG39AUY`
- **Purpose**: Manage recurring subscriptions

#### Financial Reports
- ExchangeRates (`dst13Xzyv5uTwMQ1pC`) - 💱 Currency exchange tracking
- ReportOperationalCosts (`dstHVAftneBKoeJJML`) - Operational cost analysis
- ReportPnL (`dstPYQ3wJCY4Hk1W7A`) - Profit and Loss reporting
- ReportProjects (`dstyL9ip4TUYwp1Q7B`) - Project financial reporting
- ReportProjectsWonLost (`dstz1JqwXj41Tn6aUR`) - Project success metrics
- OperationalCosts (`dstvHaZWJLjv58S7yE`) - Operational cost tracking
- ReportOperationalLeadgenCosts (`dstUmwjVowWyTJgj4p`) - Lead generation cost analysis

### 5. Lead Generation
Located in "Leadgen" folder (`fodXuUXuMJECc`)

#### Clients Table
- **ID**: `dstoHuLq5fWmzRZvna`
- **Icon**: 🙆‍♀️
- **Purpose**: Client information and management

#### Lead Generation Tables
- UW Leadgen (`dstajDegKjZCTMiR7h`) - Underwriting lead tracking
- SalesCalls (`dstDB0FlzllgWjz9jG`) - Sales call management
- CRM (`dstDfpcYqF2nW6azmR`) - Customer relationship data
- FVR Messages (`dstmwupPn0wM3F0ZH3`) - Communication tracking
- Leadgen Costs (`dstnMEStWhN1gzp3SH`) - Cost tracking for lead generation
- UW Connect Fees (`dstRCPVfN1REZzElZa`) - Underwriting connection fees
- FVR Leadgen (`dstrS0cegNHA0hQHhW`) - FVR-specific lead tracking
- 4s (`dstAATQFtfGmYUxB8Q`) - Additional lead tracking

### 6. CRM System
Located in "A Simple & Powerful CRM" folder (`fod3rUaokMFZ1`)

#### CRM Database Table
- **ID**: `dstSEXLJq65z0YjHNp`
- **Purpose**: Main CRM database

#### Visit Records Table
- **ID**: `dstkyinafMr9V3Fh4r`
- **Purpose**: Track client visits and interactions

### 7. PPC and Content
Located in "PPC News" folder (`fod72V13L5V6y`)

#### Content Tables
- YT News outlets (`dst6tT44UAipUNQELA`) - YouTube news source tracking
- YT Processed Videos (`dstF3BzW9Xo3Ai6WQD`) - Processed video content

### 8. Niche Management
Located in "Niche related" folder (`fodZ4CQ0NX5f6`)

#### Niche Tables
- Gary_Datasheet (`dst2rtUYs0jVG5hfv0`) - Niche-specific data
- TXO_Niche_Flow (`dstDM2h5fmToKqergi`) - Transaction flow tracking

### 9. Core Projects Table
Located at root level

#### Projects Table
- **ID**: `dstq4onAEtjMleaeCm`
- **Icon**: 📖
- **Purpose**: Central project management hub
- **Description**: Main table for managing all projects and their relationships

#### Key Fields
| Field Name | Type | Description |
|------------|------|-------------|
| Title | Formula | Project title (formula-generated) |
| Name | Text | Project name |
| StartDate | Text | Project start date |
| Stage | SingleSelect | Current project stage |
| Budget | Text | Project budget |
| EndDate | DateTime | Project end date |
| POCName | Text | Point of Contact name |
| POCEmail | Text | Point of Contact email |
| Communication | Text | Communication details |
| ChurnReason | Text | Reason for project churn if applicable |
| InternalCallNotes | WorkDoc | Internal notes from calls |
| QuestionnaireURL | URL | Link to project questionnaire |
| ReportSchedule | SingleSelect | Schedule for project reporting |
| MeetingSchedule | SingleSelect | Schedule for project meetings |

#### Relationship Fields
| Field Name | Type | Connected To | Description |
|------------|------|-------------|-------------|
| Subscriptions | TwoWayLink | Subscriptions table | Project subscriptions |
| Team | OneWayLink | Team table | Project team members |
| Mediabuyer | TwoWayLink | Mediabuyer table | Associated media buyers |
| Client | TwoWayLink | Clients table | Project client |
| ReportProjects | TwoWayLink | Reports table | Project reports |
| Payments | TwoWayLink | Payments table | Project payments |
| ClientCalls | TwoWayLink | Calls table | Client call records |
| ProjectReports | TwoWayLink | Reports table | Project reports |

#### Lookup Fields
| Field Name | Type | Source | Description |
|------------|------|--------|-------------|
| SubscriptionStatus | MagicLookUp | Subscriptions | Status of project subscriptions |
| NewestCallDate | MagicLookUp | ClientCalls | Date of most recent client call |
| ProjectValueUSD | MagicLookUp | - | Project value in USD |
| ClientsID | MagicLookUp | Client | Client identifier |
| SubscriptionsID | MagicLookUp | Subscriptions | Subscription identifier |

#### System Fields
| Field Name | Type | Description |
|------------|------|-------------|
| EXT_Project_id | Text | External project identifier |
| NotionID | Text | Associated Notion page ID |
| SlackChannelID | SingleText | Associated Slack channel ID |
| ClickupCallNotesPageID | SingleText | Associated Clickup page ID |
| ClickupCallNotesParentCartID | SingleText | Parent Clickup cart ID |
| RecordID | Formula | Unique record identifier |
| AW_AccountIDs | Text | Associated advertising account IDs |

## Related Tables (Inferred from Relationships)

While we don't have direct access to these tables in the current space, the Projects table links to the following tables:

1. **Clients Table**
   - Linked via `Client` field (TwoWayLink)
   - Referenced by `ClientsID` lookup field
   - Contains client information

2. **Team Table**
   - Linked via `Team` field (OneWayLink)
   - Contains team member information

3. **Subscriptions Table**
   - Linked via `Subscriptions` field (TwoWayLink)
   - Referenced by `SubscriptionsID` lookup field
   - Contains subscription details
   - Status tracked via `SubscriptionStatus` lookup field

4. **Reports Table**
   - Linked via both `ReportProjects` and `ProjectReports` fields (TwoWayLink)
   - Contains project reports

5. **Payments Table**
   - Linked via `Payments` field (TwoWayLink)
   - Contains payment records

6. **Calls Table**
   - Linked via `ClientCalls` field (TwoWayLink)
   - Contains call records
   - Latest call date tracked via `NewestCallDate` lookup field

7. **Mediabuyer Table**
   - Linked via `Mediabuyer` field (TwoWayLink)
   - Contains media buyer information

## Project Lifecycle

1. **Project Creation**
   - Required fields:
     - Name
     - StartDate
     - Stage
     - Client link
     - POC information
   - Optional but recommended:
     - Budget
     - Team assignment
     - Slack channel creation
     - Questionnaire URL

2. **Project Management**
   - Regular updates:
     - Stage updates
     - Meeting schedule
     - Report schedule
     - Client call records
     - Internal call notes
   - Tracking:
     - Payments
     - Subscriptions
     - Team assignments
     - Media buyer assignments

3. **Project Completion/Churn**
   - Required updates:
     - EndDate
     - Stage update
     - ChurnReason (if applicable)
   - Cleanup:
     - Final payment records
     - Subscription status updates
     - Final reports

## Integration Points

The database integrates with several external systems:

1. **Notion** - Project documentation
2. **Slack** - Team communication
3. **Clickup** - Task and call note management
4. **Advertising Platforms** - Ad account management

## Best Practices

1. **Data Entry**
   - Use consistent naming conventions across tables
   - Maintain proper relationships between tables
   - Keep all reference fields updated

2. **Financial Tracking**
   - Regular updates to operational costs
   - Maintain accurate payment records
   - Keep exchange rates current
   - Regular financial reporting

3. **Project Management**
   - Link projects to all relevant tables
   - Maintain client communication records
   - Keep task status updated
   - Regular project reporting

4. **Lead Generation**
   - Track all lead sources
   - Monitor lead generation costs
   - Maintain accurate client records
   - Document all client interactions

5. **Team Management**
   - Keep team assignments current
   - Track service capabilities
   - Maintain member information
   - Document team structure

## Common Workflows

1. **New Project Setup**
   - Create project in Projects table
   - Assign team members
   - Set up client relationship
   - Create associated records in ProjectReports
   - Set up payment tracking

2. **Financial Reporting**
   - Update operational costs
   - Record payments
   - Track subscriptions
   - Generate financial reports
   - Monitor exchange rates

3. **Lead Management**
   - Record new leads
   - Track lead progression
   - Document client communications
   - Monitor lead generation costs
   - Update CRM records

4. **Client Management**
   - Maintain client records
   - Track client calls
   - Record visit information
   - Monitor client projects
   - Track client-related costs

