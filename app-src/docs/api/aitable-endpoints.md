# AITable API Endpoints Reference

## Authentication

AITable API uses API tokens for authentication. The token should be included in the request header:

```
Authorization: Bearer {your_api_token}
```

## Spaces API

### Get List of Spaces

Retrieves all spaces accessible to the user.

```
GET /fusion/v1/spaces
```

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "spaces": [
      {
        "id": "spcxxxxxxx",
        "name": "Space Name",
        "role": "owner"
      }
    ]
  },
  "message": "SUCCESS"
}
```

## Nodes API

### Get Node List

Retrieves all nodes in a space.

```
GET /fusion/v1/spaces/{spaceId}/nodes
```

**Parameters:**
- `spaceId` (path): The ID of the space

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "dstxxxxxxx",
        "name": "Datasheet Name",
        "type": "Datasheet",
        "parentId": "fodxxxxxxx",
        "icon": "icon_name"
      }
    ]
  },
  "message": "SUCCESS"
}
```

### Search Nodes

Searches for specific nodes in a space.

```
GET /fusion/v1/spaces/{spaceId}/nodes/search
```

**Parameters:**
- `spaceId` (path): The ID of the space
- `keyword` (query): Search keyword
- `type` (query, optional): Node type filter (Datasheet, Form, Dashboard, etc.)

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "dstxxxxxxx",
        "name": "Datasheet Name",
        "type": "Datasheet",
        "parentId": "fodxxxxxxx",
        "icon": "icon_name"
      }
    ]
  },
  "message": "SUCCESS"
}
```

## Datasheet API

### Get Records

Retrieves records from a datasheet.

```
GET /fusion/v1/datasheets/{datasheetId}/records
```

**Parameters:**
- `datasheetId` (path): The ID of the datasheet
- `viewId` (query, optional): The ID of the view
- `fieldKey` (query, optional): Field key type, either "name" or "id" (default: "name")
- `pageSize` (query, optional): Number of records per page (default: 100)
- `pageToken` (query, optional): Token for pagination

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "records": [
      {
        "recordId": "recxxxxxxx",
        "fields": {
          "Field1": "Value1",
          "Field2": "Value2"
        }
      }
    ],
    "pageToken": "next_page_token",
    "total": 150
  },
  "message": "SUCCESS"
}
```

### Create Records

Adds new records to a datasheet.

```
POST /fusion/v1/datasheets/{datasheetId}/records
```

**Parameters:**
- `datasheetId` (path): The ID of the datasheet
- `fieldKey` (query, optional): Field key type, either "name" or "id" (default: "name")

**Request Body:**
```json
{
  "records": [
    {
      "fields": {
        "Field1": "Value1",
        "Field2": "Value2"
      }
    }
  ]
}
```

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "records": [
      {
        "recordId": "recxxxxxxx",
        "fields": {
          "Field1": "Value1",
          "Field2": "Value2"
        }
      }
    ]
  },
  "message": "SUCCESS"
}
```

### Update Records

Updates existing records in a datasheet.

```
PATCH /fusion/v1/datasheets/{datasheetId}/records
```

**Parameters:**
- `datasheetId` (path): The ID of the datasheet
- `fieldKey` (query, optional): Field key type, either "name" or "id" (default: "name")

**Request Body:**
```json
{
  "records": [
    {
      "recordId": "recxxxxxxx",
      "fields": {
        "Field1": "Updated Value1",
        "Field2": "Updated Value2"
      }
    }
  ]
}
```

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "records": [
      {
        "recordId": "recxxxxxxx",
        "fields": {
          "Field1": "Updated Value1",
          "Field2": "Updated Value2"
        }
      }
    ]
  },
  "message": "SUCCESS"
}
```

### Delete Records

Deletes records from a datasheet.

```
DELETE /fusion/v1/datasheets/{datasheetId}/records
```

**Parameters:**
- `datasheetId` (path): The ID of the datasheet

**Request Body:**
```json
{
  "recordIds": ["recxxxxxxx", "recyyyyyyy"]
}
```

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {},
  "message": "SUCCESS"
}
```

## Fields API

### Get Fields

Retrieves field definitions from a datasheet.

```
GET /fusion/v1/datasheets/{datasheetId}/fields
```

**Parameters:**
- `datasheetId` (path): The ID of the datasheet
- `viewId` (query, optional): The ID of the view

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "fields": [
      {
        "id": "fldxxxxxxx",
        "name": "Field Name",
        "type": "Text",
        "property": {}
      }
    ]
  },
  "message": "SUCCESS"
}
```

## Views API

### Get Views

Retrieves views from a datasheet.

```
GET /fusion/v1/datasheets/{datasheetId}/views
```

**Parameters:**
- `datasheetId` (path): The ID of the datasheet

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "views": [
      {
        "id": "viwxxxxxxx",
        "name": "View Name",
        "type": "Grid"
      }
    ]
  },
  "message": "SUCCESS"
}
```

## Embedded Links API

### Create Embedded Links

Creates links between nodes.

```
POST /fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks
```

**Parameters:**
- `spaceId` (path): The ID of the space
- `nodeId` (path): The ID of the node

**Request Body:**
```json
{
  "embedLinks": [
    {
      "datasheetId": "dstxxxxxxx",
      "recordId": "recxxxxxxx"
    }
  ]
}
```

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "embedLinks": [
      {
        "id": "emlxxxxxxx",
        "datasheetId": "dstxxxxxxx",
        "recordId": "recxxxxxxx"
      }
    ]
  },
  "message": "SUCCESS"
}
```

### Get Embedded Links

Retrieves links between nodes.

```
GET /fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks
```

**Parameters:**
- `spaceId` (path): The ID of the space
- `nodeId` (path): The ID of the node

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "embedLinks": [
      {
        "id": "emlxxxxxxx",
        "datasheetId": "dstxxxxxxx",
        "recordId": "recxxxxxxx"
      }
    ]
  },
  "message": "SUCCESS"
}
```

### Delete Embedded Links

Removes links between nodes.

```
DELETE /fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks
```

**Parameters:**
- `spaceId` (path): The ID of the space
- `nodeId` (path): The ID of the node

**Request Body:**
```json
{
  "embedLinkIds": ["emlxxxxxxx", "emlyyyyyyy"]
}
```

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {},
  "message": "SUCCESS"
}
``` 