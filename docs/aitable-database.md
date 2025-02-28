# AITable Database Documentation

Last updated: 2025-02-26T19:30:57.882Z

Space ID: spc12q5HY4ay5

Here're the datasheets we're using in this app.

Projects ID dstq4onAEtjMleaeCm
here we store information about projects. projects are connected to clients, subscriptions, payments and other datasheets

Client Calls ID dstsdypzYzmT0cjaEJ
here we store client calls, they're connected to projects

ProjectReports ID dstUEbWw5AD1tEPoPE
Here we track which project's report was send during which week

Services ID dstFrV4py2zW3yFFGg
A small table linking services like google ads and facebook ads to different teams

Members ID dstEn1hH4TxaEoEC0W
team members connected to teams as either leaders or members, here we store salary and other details

Teams ID dstCv7Y9Hkhf4AQcDA
Here we define teams and what service they do plus team leaders and team members

ReportProjectsWonLost ID dstz1JqwXj41Tn6aUR
A report we do monthly to sum up how many new projects we have won and lost

EchangeRates ID dst13Xzyv5uTwMQ1pC
here we stored currency exchange rates but wasn't updated for quite some time

ReportPnL ID dstPYQ3wJCY4Hk1W7A
here we want to store financial reports (PnL) so we know how many invoices were paid and yet not paid.

ReportOperationalLeadgenCosts ID dstUmwjVowWyTJgj4p
here we want to store our leadgen costs per platform like UW - upwork and fvr - fiverr

ReportOperationalCosts ID dstHVAftneBKoeJJML
Here we want to store operational costs reports (so sum ups)

OperationalCosts ID dstvHaZWJLjv58S7yE
Here we store all the operational costs and we assigned types to them and other metrics

ReportProjects ID dstyL9ip4TUYwp1Q7B
here we store reports for each project so we know what is the final margin per project

Payments ID dst6yHG1gcUHquvMD0
Here we store all payments that we then need to assign 

Subscriptions ID dst93iSE1ToDG39AUY
Subscriptions are connected to clients, projects and payments. Basically every client pays mostly as a subscription so we want to track those.

FVR Messages ID dstmwupPn0wM3F0ZH3
Here we were tracking all messages on fiverr but the chrome extension stopped working.

Clients ID dstoHuLq5fWmzRZvna
Here we store clients. Clients can have multiple projects connected to them and subscriptions and payments.

FVR Leadgen ID dstrS0cegNHA0hQHhW
fiverr tracking sheet for leadgeneration

UW Leadgen ID dstajDegKjZCTMiR7h
upwork leadgen sheet also for leadgeneration

Leadgen Costs ID dstnMEStWhN1gzp3SH
a sheet to track leadgen costs we haven't used

CRM ID dstDfpcYqF2nW6azmR
it's our crm we use with statuses and everything. we can say it's a core our of leadgen tracking

4s ID dstAATQFtfGmYUxB8Q
here we track all 4somes we're doing, important for leadgen

UW Connect Fees ID dstRCPVfN1REZzElZa
here we should track how much we're spending on upworks connects but it's empty so something is broken.

SalesCalls ID dstDB0FlzllgWjz9jG
Here we track all sales calls that are tracked via krisp.ai we then match them with records in our crm