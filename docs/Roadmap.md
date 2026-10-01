we're building an app to manage our agency.
this app is mainly going to connect with aitable api through server side and show us data.
We will also want to edit certain values.
Aitable is an airtable clone so has also one way or two way links.

This app has to have different access rights:
- CEO - sees everything
- CFO - sees financial summaries etc
- SalesManager - sees leadgen related metrics
- PM - sees situation on projects

i've described what datasheets we have in aitable in aitable-database.md file

Ok that's what we want to do.

#Stage 1
An app that connects with aitable through server side.
This app has to have a login/password function with some request limiter. those passwords can be as ENV values.
Mind we have .env.local file already made

Inside of this app we can review content of each table I've described. Currently as a list on the left side.
List has to be paginated with option to choose 20,50,100 records.
The default date range should be current month with options to choose, past month, past quarter, past/current year and an ability to pick data range. We also want to be able to do search query by a picked field.

When working with aitable you will see we have two spaces only focus on the texonica one, you got the id.

make sure to add a lot of logs that are easy for you to read in the console so we don't have to waste our time clicking around in the web interface.

