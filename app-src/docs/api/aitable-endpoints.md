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
- `type` (query, optional): Filter by node type (Folder, Datasheet, Form, Dashboard)
- `parentId` (query, optional): Filter by parent folder ID
- `permissions` (query, optional): Filter by permission levels (0 = readonly, 1 = edit, 2 = manage)

**Response Example:**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "dstxxxxxxx",
        "name": "Node Name",
        "type": "Datasheet",
        "parentId": "fodxxxxxxx",
        "icon": "icon_name",
        "permissions": [0, 1, 2]
      }
    ]
  },
  "message": "SUCCESS"
}
```

### Get Node Details

Retrieves details of a specific node.

```
GET /fusion/v1/spaces/{spaceId}/nodes/{nodeId}
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
    "node": {
      "id": "dstxxxxxxx",
      "name": "Node Name",
      "type": "Datasheet",
      "parentId": "fodxxxxxxx",
      "icon": "icon_name",
      "permissions": [0, 1, 2]
    }
  },
  "message": "SUCCESS"
}
```

### Update Node

Updates a node's properties.

```
PATCH /fusion/v1/spaces/{spaceId}/nodes/{nodeId}
```

**Parameters:**
- `spaceId` (path): The ID of the space
- `nodeId` (path): The ID of the node
- Request Body:
  ```json
  {
    "name": "New Name",
    "icon": "new_icon",
    "description": "New description",
    "parentId": "new_parent_id"
  }
  ```

### Delete Node

Deletes a node.

```
DELETE /fusion/v1/spaces/{spaceId}/nodes/{nodeId}
```

**Parameters:**
- `spaceId` (path): The ID of the space
- `nodeId` (path): The ID of the node

## Folders API

### Create Folder

Creates a new folder.

```
POST /fusion/v1/spaces/{spaceId}/folders
```

**Parameters:**
- `spaceId` (path): The ID of the space
- Request Body:
  ```json
  {
    "name": "Folder Name",
    "parentId": "parent_folder_id",
    "icon": "folder_icon"
  }
  ```

### Get Folder Children

Retrieves all nodes within a folder.

```
GET /fusion/v1/spaces/{spaceId}/nodes?parentId={folderId}
```

**Parameters:**
- `spaceId` (path): The ID of the space
- `parentId` (query): The ID of the parent folder
- `type` (query, optional): Filter by node type

## Datasheets API

### Create Datasheet

Creates a new datasheet.

```
POST /fusion/v1/spaces/{spaceId}/datasheets
```

**Parameters:**
- `spaceId` (path): The ID of the space
- Request Body:
  ```json
  {
    "name": "Datasheet Name",
    "parentId": "parent_folder_id",
    "description": "Datasheet description",
    "icon": "datasheet_icon"
  }
  ```

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

### Create Records

Creates new records in a datasheet.

```
POST /fusion/v1/datasheets/{datasheetId}/records
```

**Parameters:**
- `datasheetId` (path): The ID of the datasheet
- `fieldKey` (query, optional): Field key type, either "name" or "id"
- Request Body:
  ```json
  {
    "records": [
      {
        "fields": {
          "field1": "value1",
          "field2": "value2"
        }
      }
    ]
  }
  ```

### Update Records

Updates existing records in a datasheet.

```
PATCH /fusion/v1/datasheets/{datasheetId}/records
```

**Parameters:**
- `datasheetId` (path): The ID of the datasheet
- `fieldKey` (query, optional): Field key type, either "name" or "id"
- Request Body:
  ```json
  {
    "records": [
      {
        "recordId": "recxxxxxxx",
        "fields": {
          "field1": "new_value1",
          "field2": "new_value2"
        }
      }
    ]
  }
  ```

### Delete Records

Deletes records from a datasheet.

```
DELETE /fusion/v1/datasheets/{datasheetId}/records
```

**Parameters:**
- `datasheetId` (path): The ID of the datasheet
- Request Body:
  ```json
  {
    "recordIds": ["recxxxxxxx", "recyyyyyyy"]
  }
  ```

## Fields API

### Get Fields

Retrieves fields from a datasheet.

```
GET /fusion/v1/datasheets/{datasheetId}/fields
```

**Parameters:**
- `datasheetId` (path): The ID of the datasheet
- `viewId` (query, optional): The ID of the view

## Views API

### Get Views

Retrieves views from a datasheet.

```
GET /fusion/v1/datasheets/{datasheetId}/views
```

**Parameters:**
- `datasheetId` (path): The ID of the datasheet

## Embedded Links API

### Create Embedded Links

Creates embedded links for a node.

```
POST /fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks
```

**Parameters:**
- `spaceId` (path): The ID of the space
- `nodeId` (path): The ID of the node
- Request Body:
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

### Get Embedded Links

Retrieves embedded links for a node.

```
GET /fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks
```

**Parameters:**
- `spaceId` (path): The ID of the space
- `nodeId` (path): The ID of the node

### Delete Embedded Links

Deletes embedded links from a node.

```
DELETE /fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks
```

**Parameters:**
- `spaceId` (path): The ID of the space
- `nodeId` (path): The ID of the node
- Request Body:
  ```json
  {
    "embedLinkIds": ["emlxxxxxxx", "emlyyyyyyy"]
  }
  ``` 