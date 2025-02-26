# AITable API Reference

## Base URL
```
https://api.aitable.com/fusion/v1/
```

> Note: Must use HTTPS, and cannot use an HTML request.

## Common Parameters

### spaceId
A unique identifier for a workspace in AITable. Each user may create or be invited to multiple spaces.

### nodeId
Each space has a work directory with many file nodes. Each node has an ID (nodeId).
File node types include:
- Datasheet: nodeId starts with `dst`, e.g., `dstZsEg3RpBvsdCgoop`
- Folder: nodeId starts with `fod`, e.g., `fod23ha5NvyM5`
- Form: nodeId starts with `fom`, e.g., `fom68eghkCem0wZxk`
- Dashboard: nodeId starts with `dsb`, e.g., `dsbWxTei5gdTvdAfKM`

### datasheetId
Each datasheet has a corresponding AITableID (datasheetId). A datasheetId must be specified when calling the API to add and delete datasheet.

### viewId
Multiple views may be created in a datasheet. Each view has a view ID (viewId).

### recordId
A table consists of several lines of records, each with a corresponding record ID (recordId).

### fieldId
A datasheet consists of several columns, each corresponding to one field. Each field has a field ID (fieldId).

### unitId
A unique ID for each member, team, and role in the Contacts system.

## API Endpoints

### Records
- **Get Records**: Retrieve records from a datasheet
- **Create Records**: Add new records to a datasheet
- **Update Records**: Modify existing records in a datasheet
- **Delete Records**: Remove records from a datasheet

### Fields
- **Get Fields**: Retrieve field definitions from a datasheet
- **Create Fields**: Add new fields to a datasheet
- **Delete Fields**: Remove fields from a datasheet

### Views
- **Get Views**: Retrieve views from a datasheet

### Datasheet
- **Create Datasheet**: Create a new datasheet

### Attachment
- **Uploading Attachments**: Upload files as attachments

### Space
- **Get the List of Spaces**: Retrieve all spaces accessible to the user

### Node
- **Get Node List**: Retrieve all nodes in a space
- **Search Nodes**: Search for specific nodes
- **Get Node Details**: Retrieve detailed information about a node
- **Create Embedded Links**: Create links between nodes
- **Get Embedded Links**: Retrieve links between nodes
- **Delete Embedded Links**: Remove links between nodes

### Contacts
- **Member**
  - Get a Member
  - Update a Member
  - Delete a Member
- **Team**
  - List Teams
  - List the Team Members
  - Create a Team
  - Update a Team
  - Delete a Team
- **Role**
  - List Roles
  - List Units under the Role
  - Create a Role
  - Update a Role
  - Delete a Role

### AI
- **Create chat completions**: Interact with AI capabilities

## Authentication
Authentication details will be added based on the official documentation.

## Rate Limits
Rate limit information will be added based on the official documentation.

## Error Handling
Error handling information will be added based on the official documentation. 