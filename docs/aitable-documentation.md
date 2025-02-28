# AITable API Reference manual | AITable Developer Center

source of this file is here https://developers.aitable.ai/api/reference

[

![AITable Developer Center](/img/apitable-logo-dark.svg)

](/)

[English](#)

*   [English](/api/reference)
*   [中文（中国）](/zh-CN/api/reference)

[API](#)

*   [Development Guide](/api/introduction)
*   [API Reference](/api/reference)
*   [Changelog](/changelog/api)
*   [API Chinese reference](/api/cn/reference)

[Widget](#)

*   [Development Guide](/widget/introduction)
*   [API Reference](/widget/api-reference)
*   [Changelog](/changelog/widget)

[Script](#)

*   [Development Guide](/script/introduction)
*   [API Reference](/script/api-reference)
*   [Changelog](/changelog/script)

⌘K

[GitHub](https://github.com/apitable/apitable)[Self-hosted](https://apitable.getoutline.com/s/82e078fc-1a8d-4616-b69d-fcdbb18ef715)

*   Introduction
*   Authentication
*   Restrictions
*   Status Codes
*   BASIC
    *   Record
        *   getGet Records
        *   postCreate Records
        *   patchUpdate Records
        *   delDelete Record
    *   Field
        *   getGet Field
        *   postCreate Field
        *   delDelete Field
    *   View
        *   getGet View
    *   Datasheet
        *   postCreate Datasheet
    *   Attachment
        *   postUpload Attachment
*   ADVANCED
    *   Space
        *   getGet the List of Spaces
    *   Node
        *   getGet Node List
        *   getSearch Nodes
        *   getGet Node Details
        *   postCreate embedded links
        *   getGet list of embedded links
        *   delDelete embedded link
    *   AI
        *   postCreate chat completions
*   CONTACTS
    *   Member
        *   getGet a member
        *   putUpdate a member
        *   delDelete a member
    *   Team
        *   getList the team members
        *   getList sub teams
        *   postCreate a team
        *   putUpdate a team
        *   delDelete a team
    *   Role
        *   getList units under the role
        *   getList roles
        *   postCreate a role
        *   putUpdate a role
        *   delDelete a role

[![redocly logo](https://cdn.redoc.ly/redoc/logo-mini.svg)API docs by Redocly](https://redocly.com/redoc/)

# AITable API Reference manual (beta)

> **Reminder:**
> 
> The current API is in beta, we may add new interface return value properties, but will not remove properties that already exist.If the API does not return the data you need, feel free to feedback to us.

This reference manual is intended to help you gain a comprehensive understanding of the AITable API.

> **Recommendation:**
> 
> If you haven't learned about the AITable API before, it is recommended that you start with [AITable API Introduction](/api/introduction).

The navigation area on the left side of this page provides detailed information about each API interface (including records, fields, views, attachments, spaces, and working directories).

The code area on the right of this page allows you to find sample requests and sample responses for each API interface, making it easy to copy the code you need directly.

## [](#section/Introduction)Introduction

The base URL for the AITable API request is `https://aitable.ai`.

> Note: https requests must be used, not http requests.

The AITable API follows the RESTful API convention as much as possible, i.e. data is added, deleted, and checked via `GET`, `POST`, `PATCH`, and `DELETE` requests to the space and AITable resources.

The request and response bodies are encoded in JSON format.

The parameter names in JSON use camel naming (e.g. viewId) and are case sensitive.

## [](#section/Authentication)Authentication

### Way 1: By API token

API Token is the user authentication token.When you send an API request to the AITable server, you must include `Authorization: Bearer {Your API Token}` in the request header to facilitate the server's authentication of the user's identity.

After successful authentication, this API request will have the same privileges as the user's operations in the AITable interface, i.e. whatever data the user can operate on the interface, this request can also operate on it.

Take the following cURL request as an example.

```bash
curl "https://aitable.ai/fusion/v1/datasheets/{datasheetId}/records" \
  -H "Authorization: Bearer {Your API Token}" \
```

Its request header includes.

Name

Data Type

Required

Format of Value

Example Value

Authorization

String (string)

Yes

`Bearer {Your API Token}`

`Bearer uskYtInkHozfsMikhh0yfoS`

For specific authentication operations, please refer to [Quick Start](/api/quick-start)

### Way 2: OAuth2 (WIP)

## [](#section/Restrictions)Restrictions

When sending API requests, you need to be aware of several restrictions: frequency restrictions, interface restrictions, usage restrictions.

### Frequency limits

Different space levels will have the following API request rates limits when requesting the API using user tokens:

*   Free space: 2 QPS, suitable for API learning and experience.
*   Plus space: 5 QPS, suitable for personal application development.
*   Pro space: 10 QPS, suitable for team application development and operation.
*   Enterprise space: 20 QPS, suitable for enterprise-level internal application development and high-concurrency scenarios.

Click to view [the pricing page of AITable](https://aitable.ai/pricing/)

If the request frequency exceeds the limit, an error "Operation too frequent" will be displayed (error status code 429).

### API limits

*   Get records interface: Get up to 1000 rows of records at a time.  
    For example, if you want to fetch 10000 rows of records in bulk, you need to call the Get Records interface at least 10 times.  
      
    
*   Create records interface: Create up to 10 rows of records at a time.  
    For example, if you want to create 1000 rows of records in a batch, you need to call the Create Record interface at least 100 times.  
      
    
*   Update records interface: update up to 10 rows of records at a time.  
    For example, if you want to update 1000 rows of records in a batch, you need to call the Update Record interface at least 100 times.  
      
    
*   Delete records interface: Delete up to 10 rows of records at a time.  
    For example, if you want to delete 1000 rows of records in a batch, you need to call the Delete Record interface at least 100 times.  
      
    
*   Upload attachments interface: only 1 attachment can be uploaded at a time. If you need to upload multiple files, you need to call this interface repeatedly.

### Usage limits

There are two types of usage limits: one is the limit of API usage; the other is the limit of space resource usage, for details, please refer to [pring page](https://aitable.ai/pricing).

The maximum capacity of uploading attachments to a single space is 1 GB.

## [](#section/Status-Codes)Status Codes

Each time you send an API request, the application returns a business status code and a corresponding message.

If the request fails, you can troubleshoot it based on the status code and error message returned.

**HTTP Status Code**

**Response Message**

**Business Status Code**

Description

200

SUCCESS

200

`GET`, `PATCH`, `DELETE` requests work and return results as expected

201

SUCCESS

200

`POST` request works and returns results as expected

200

Cannot find the specified datasheet

301

Possible scenarios:  
1) The datasheet may have been deleted  
2) The user cannot find the datasheet in their own space list

200

Failed to upload attachment

426

Possible scenarios:  
① Attachments exceed the 1 GB size limit  
② The space has reached its maximum attachment capacity

200

The number of uploaded attachments exceeds the limit

428

Upload attachments can only upload one per call, beyond this error will be reported

200

Operation without node permission

602

Users do not have access rights to the specified datasheet (e.g., manageable, editable, or read-only)

200

(Refer to the specific error message)

400

Parameter exception, data verification exception

401

Authentication failure

401

Possible scenarios:  
① API Token is not passed in the request header  
② API Token is incorrect

403

Prohibit access

403

Possible scenarios:  
① The number of API calls has exceeded the limit  
② Unable to get the API usage quota for the space, please try again later

404

Interface does not exist

404

Please check if the request address is correct

429

Operate too often

429

The maximum request Different space levels will have the following API request rates limits,you can read [the AITable pricing page](https://aitable.ai/pricing/)

500

SERVER\_ERROR (code)

500

Unhandled exceptions for internal services

200

You have exceeded the "Public Beta" limit of 50,000 lines

304

The number of rows in the table has reached the maximum number of rows in a single table, please replace the number of tables as soon as possible to avoid data loss

# [](#tag/Record)Record

At the present time, AITable is open to the interfaces of getting records, creating records, updating records and deleting records.

The data structure of the records is as follows.

Properties

Description

recordId

string  
record ID  
e.g. `"rec1jV9eWxcaB"`

createdAt

number  
The creation time of the record, in timestamp format  
e.g. `1624960629000`

updatedAt

number  
The modification time of this record, in timestamp format  
e.g. `1624964696000`

fields

object  
the data of the corresponding field in a record, returned in the format `{"fieldName": fieldValue}`

When using the [Create Records](create-records) or [Update Records](update-records) API to write to fields, you need to understand the data type and structure of each field value.

Note: calculated fields do not allow values to be written actively, including: AutoNumber, Formula, MagicLookUp, LastModifiedTime, CreatedTime, LastModifiedBy, CreatedBy, etc.

For reference,the following table lists the values of different types of fields:

Field Types

Description

SingleText

string  
returns a string without "\\n" line breaks  
e.g. `{"fieldName": "an example title"}`

Text

string  
returns a string with "\\n" line breaks  
e.g. `{"fieldName": "a long text"}`

SingleSelect

string  
returns the selected option as a string  
e.g. `{"fieldName": "done"}`

MultiSelect

array of strings  
returns the selected options as an array of strings  
e.g. `"{"fieldName": ["Option1", "Option2"]}`

Number

number  
returns a positive or negative number. The return result will not include the precision or symbol given in the field settings.  
e.g. `"{"fieldName": 1998}`

Currency

number  
returns a positive or negative number. The return result will not include the precision or symbol given in the field settings.  
e.g. `"{"fieldName": 999}`

Percent

number  
returns a positive or negative number. The return result will not include the precision or symbol given in the field settings.  
e.g. `"{"fieldName": 0.1}`

DateTime

number  
returns a timestamp in milliseconds  
e.g. `"{"fieldName": 1678723200000}`

Attachment

array of attachment objects  
returns an array of attachment objects. Each object includes the following properties:  
1\. mimeType (string): the media type of the attachment;  
2\. name (string): the name of the attachment;  
3\. size (number): the size of the attachment (byte);  
4\. width (number): the width of the image (px), if the attachment is an image;  
5\. height (number): the height of the image (px), if the attachment is an image;  
6\. token (string): the access path of the attachment;  
7\. preview (string): the preview image URL that you can open in a browser, if the attachment is a PDF  
e.g. `{"fieldName":[{"id":"atcFagvJrELTS","name":"logo.png","size":6396,"mimeType":"image/png","token":"space/2023/03/17/ee1bb79d3fd847e383e21c9b0bd53dfc","width":424,"height":80,"url":"https://legacy-s1.aitable.ai/space/2023/03/17/ee1bb79d3fd847e383e21c9b0bd53dfc"}]}`

Member

array of unit objects  
returns an array of unit objects. A unit describes the roles in a Space such as a member or a team.  
\- id: string, the ID of the organizational unit  
\- type: number, the type of organizational unit, 1 is the group, 3 is the member  
\- name: string, the name of the group or member  
\- avatar: string, avatar URL, read-only, not writable  
e.g. `{"fieldName":[{"id":"1291258301781176321","type":3,"name":"Jane","avatar":"https://s1.aitable.ai/space/2023/02/09/79e112dd10424ac7842256736e4f5568"}]}`

Checkbox

boolean  
returns true as boolean format if the checkbox is checked. Otherwise the return result will not include this Checkbox field.  
e.g. `{"fieldName": true}`

Rating

number  
returns a positive number between 1 and 10. The return result will not include this field if the value is empty.  
e.g. `{"fieldName": 5}`

URL

url object  
returns a URL object, including title (webpage title), text (webpage address), favicon (webpage icon)  
e.g. `{"fieldName":{"title":"AITable","text":"https://aitable.ai","favicon":"https://legacy-s1.aitable.ai/space/2022/12/08/f8693e8f39774a1c8f0b937f39da0e17"}}`

Phone

string  
returns a phone number as a string  
e.g. `{"fieldName": "(310) 3xx-5xxx"}`

Email

string  
returns a email address as a string  
e.g. `{"fieldName": "support@aitable.ai"}`

WorkDoc

array of workdoc objects  
returns an array of workdoc objects. Each object includes the following properties:  
\- documentId : string，document ID  
\- title: string，document title  
e.g. `{"fieldName":[{"documentId":"docCqiLTtyx4l","title":"I am title"}]}`

OneWayLink

array of record IDs (strings)  
returns an array of strings. Each string is the ID of a record that is added into the One-way link field.  
e.g. `{"fieldName": ['recz9eeg61SEa']}`

TwoWayLink

array of record IDs (strings)  
returns an array of strings. Each string is the ID of a record that is added into the Two-way link field.  
e.g. `{"fieldName": ['recz9eeg61SEa']}`

MagicLookUp

array of any  
returns a number, string, or array. The Lookup result is calculated by the system. You can't write into the Lookup field by API.  
e.g. `{"fieldName": ['Reference data 1', 'Reference data 2']}`

Formula

string | number | boolean  
returns a number, string, or boolean result. The formula result is calculated by the system. You can't write into the Formula field by API.

AutoNumber

number  
returns a positive number. The system automatically generates the numbers so you can't write into the field by API.  
e.g. `{"fieldName": 1}`

## [](#tag/Record/operation/get-records)Get Records

This interface is used to get the records of the specified datasheet.

*   Request address: [https://aitable.ai/fusion/v1/datasheets/{datasheetId}/records](https://aitable.ai/fusion/v1/datasheets/%7BdatasheetId%7D/records)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {your API Token}`

The area on the right provides sample requests for cURL, Javascript SDK for your reference.

> If you need more detailed operation guidance, you can read the [get-records](/api/get-records) operation guide of API Guide.

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

datasheetId

required

string

Example: dst0Yj5aNeoHldqvf6

AITable Datasheet ID

##### query Parameters

pageSize

number

Default: 100

Example: pageSize=100

How many records are returned per page. By default, 100 records are returned per page. The value range is an integer from 1 to 1000.

maxRecords

number

Example: maxRecords=1000

How many records are returned in total. If maxRecords and pageSize are used at the same time, and the value of maxRecords is less than the total number of records, only the setting of maxRecords will take effect.

pageNum

number

Default: 1

Example: pageNum=1

Specifies the page number of the page, which is used in conjunction with the pageSize parameter. For example, 'pageSize=1000&pageNum=2' returns records between 1001 and 2000.

sort

Array of objects

Sort the returned records. Sort is an array of multiple sort objects.The structure of a single sort object is `{"order":"asc or desc", "field":"Field name or field ID"}`.Query Example `sort[][field]=Customer Name&sort[][order]=asc`,The returned records are sorted alphabetically in the Customer Name column.If sort and viewId are used at the same time, the sort condition specified by sort will overwrite the sort condition in the view.

recordIds

Array of strings

Example: recordIds=rec4zxfWB5uyM

Returns a specified record. Example of obtaining multiple records:`&recordIds=rec4zxfWB5uyM&,reclNflLgtzjY`. The returned results are sorted according to the order in which the recordIds are passed in. No paging, up to 1000 records can be returned each time.

viewId

string

Example: viewId=viwG9l1VPD6nH

When the viewId is not explicitly specified, all records and fields are returned.When the viewId is explicitly specified, all records in the specified view will be returned in turn according to the sorting in the specified view.Note that the hidden fields in the view will not appear in the returned results.

fields

Array of strings

The returned record results are limited to the specified fields.cURL Query Example. 1. `&fields=name,age` (when `&fieldKey=name`) 2. `&fields=fldWooy3c3Puz,fldEAr5y7Go5S` (when `&fieldKey=id`).Both of the above two writing methods specify that the returned record only contains two columns 「Name」 and 「Age」.

filterByFormula

string

Use smart formulas to filter records.The formula can be used for reference[《Formula Overview》](https://help.aitable.ai/docs/guide/manual-formula-field-overview).If filterByFormula and viewId are used at the same time, all records in the specified view that meet this formula will be returned.Query Example. `&filterByFormula={Title}="tittle 1"`(You need to use the encodeURIComponent() function to escape the '{Title}="Heading 1"'.) You can accurately match the record with the value of "Heading 1" in the "Heading" column.

cellFormat

string

Default: "json"

Enum: "string" "json"

The type of the value in the cell. The default is `json`. When `string` is specified, all values will be automatically converted to string format. When `string` is specified, if the returned records contain date-time values, these values will use the time zone given in the following order (priority from high to low):

1.  If the date-time field has set a time zone, use that one.
2.  If the user has set a time zone in user settings, use that one.
3.  Use the default time zone (UTC-5, America/Toronto).

fieldKey

string

Default: "name"

Enum: "name" "id"

The key used when querying fields and returning fields. The default is' name '(field name). When 'id' is specified, fieldId will be used as the query and return method (use 'id' can avoid code invalidation caused by modifying field names).

### Responses

**200**

get/fusion/v1/datasheets/{datasheetId}/records

AITable API server address

https://aitable.ai/fusion/v1/datasheets/{datasheetId}/records

### Request samples

*   cURL
*   JavaScript SDK

Copy

curl \-X GET \\
"https://aitable.ai/fusion/v1/datasheets/{Replace with yours datasheetId}/records" \\
\-H "Authorization: Bearer {Replace your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "pageNum": 1,              *   "records": [                  *   {                          *   "recordId": "recV3ElniQavTNyJG",                              *   "fields": { },                              *   "createdAt": 0,                              *   "updatedAt": 0                                           }                               ],              *   "pageSize": 100,              *   "total": 500                   }       }`

## [](#tag/Record/operation/create-records)Create Records

This interface is used to create a new record in the specified datasheet.A maximum of 10 records can be created in a single request.

*   Request address: [https://aitable.ai/fusion/v1/datasheets/{datasheetId}/records](https://aitable.ai/fusion/v1/datasheets/%7BdatasheetId%7D/records)
*   Request method: `POST`
*   The request header must contain.
    *   `Authorization: Bearer {your API Token}`
    *   `Content-Type: application/json`

Example requests for cURL, Javascript SDK are provided in the area on the right for your reference.

A POST packet will contain a `records` array with several records to be created.

The object `fields` contains the fields to be created in a record and the corresponding values, and can contain any number of field values; fields not explicitly specified will be left blank.

> If you need more detailed instructions, you can read the [create-records](/api/create-records) instructions in the API Guide.

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

datasheetId

required

string

Example: dst0Yj5aNeoHldqvf6

AITable Datasheet ID

##### query Parameters

viewId

string

Example: viewId=viwG9l1VPD6nH

When the viewId is not explicitly specified, all fields that are not empty are returned; When the viewId is explicitly specified, the fields that are not hidden and are not empty in the specified view are returned.

##### Request Body schema: application/json

Request body structure

records

required

Array of objects (FieldCreateRo)

The record data to be created, including the recorded fields and field values.

fieldKey

string

Default: "name"

Enum: "name" "id"

The key used when writing fields and returning fields. The default is' name '(field name). If you want to use fieldId as the write and return method, you need to explicitly specify it as' id '(using' id 'can avoid code invalidation caused by modifying field names).

### Responses

**201**

post/fusion/v1/datasheets/{datasheetId}/records

AITable API server address

https://aitable.ai/fusion/v1/datasheets/{datasheetId}/records

### Request samples

*   Payload
*   cURL
*   JavaScript SDK

Content type

application/json

Copy

Expand all Collapse all

`{  *   "records": [          *   {                  *   "fields": {                          *   "matter": "「Organization Module - Organization of the address book panel",                              *   "problem description": "It is essentially the same as the above requirements",                              *   "classification": "Product demand",                              *   "Review date": "2019-10-30T00:00:00.000Z"                                           }                               },              *   {                  *   "fields": {                          *   "matter": "「Member」 module - set the department",                              *   "Problem description": "After selecting a person, you can adjust multiple departments to which he belongs\nAfter selecting a department, you can also add members to the current department",                              *   "classification": "product demand",                              *   "review date": "2019-10-29T16:00:00.000Z"                                           }                               }                   ],      *   "fieldKey": "name"       }`

### Response samples

*   201

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "records": [                  *   {                          *   "recordId": "recV3ElniQavTNyJG",                              *   "fields": { },                              *   "createdAt": 0,                              *   "updatedAt": 0                                           }                               ]                   }       }`

## [](#tag/Record/operation/update-records)Update Records

This interface is used to update the records in the specified datasheet.A maximum of 10 records can be updated in a single request.

*   Request address: [https://aitable.ai/fusion/v1/datasheets/{datasheetId}/records](https://aitable.ai/fusion/v1/datasheets/%7BdatasheetId%7D/records)
*   Request method: `PATCH`
*   The request header must contain.
    *   `Authorization: Bearer {your API Token}`
    *   `Content-Type: application/json`

Example requests for cURL, Javascript SDK are provided in the right area for your reference.

The object `fields` contains the fields in a record to be updated and the corresponding values. Only fields that are explicitly specified will update the data, fields that are not specified will retain the old values.

If you need to clear the value of a field, you can set it to `null`.For example, `"Status": null` will clear the value of the "Status" column corresponding to the record.

> If you need more detailed operation instructions, you can read the [Update Records](/api/update-records) operation guide of the "API Guide".

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

datasheetId

required

string

Example: dst0Yj5aNeoHldqvf6

AITable Datasheet ID

##### query Parameters

viewId

string

Example: viewId=viwG9l1VPD6nH

When the viewId is not explicitly specified, all fields that are not empty are returned; When the viewId is explicitly specified, the fields that are not hidden and are not empty in the specified view are returned.

##### Request Body schema: application/json

Request body structure

records

required

Array of arrays

The record data to be updated, including the record fields and field values.

fieldKey

string

Default: "name"

Enum: "name" "id"

The key used when writing fields and returning fields. The default is' name '(field name).If you want to use fieldId as the write and return method, you need to explicitly specify it as' id '(using' id 'can avoid code invalidation caused by modifying field names).

### Responses

**200**

patch/fusion/v1/datasheets/{datasheetId}/records

AITable API server address

https://aitable.ai/fusion/v1/datasheets/{datasheetId}/records

### Request samples

*   Payload
*   cURL
*   JavaScript SDK

Content type

application/json

Copy

Expand all Collapse all

`{  *   "records": [          *   {                  *   "recordId": "recrHnjVuH6Fd",                      *   "fields": {                          *   "currency": 5.53,                              *   "single choice": "Single choice 1"                                           }                               },              *   {                  *   "recordId": "recwZ6yV3Srv3",                      *   "fields": {                          *   "currency": 5.53,                              *   "single choice": "Single choice 2"                                           }                               }                   ],      *   "fieldKey": "name"       }`

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "records": [                  *   {                          *   "recordId": "recV3ElniQavTNyJG",                              *   "fields": { },                              *   "createdAt": 0,                              *   "updatedAt": 0                                           }                               ]                   }       }`

## [](#tag/Record/operation/delete-records)Delete Record

This interface is used to delete records from a particular datasheet.A maximum of 10 records can be deleted in a single request.

*   Request address: [https://aitable.ai/fusion/v1/datasheets/{datasheetId}/records](https://aitable.ai/fusion/v1/datasheets/%7BdatasheetId%7D/records)
*   Request method: `DELETE`
*   The request header must contain.
    *   `Authorization: Bearer {your API Token}`
    *   `Content-Type: application/json`

Example requests for cURL, Javascript SDK are provided in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [delete-records](/api/delete-records) operation guide in the "API Guide".

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

datasheetId

required

string

Example: dst0Yj5aNeoHldqvf6

AITable Datasheet ID

##### query Parameters

recordIds

required

Array of strings

Example: recordIds=recwZ6yV3Srv3

ID of the record to be deleted.

### Responses

**200**

delete/fusion/v1/datasheets/{datasheetId}/records

AITable API server address

https://aitable.ai/fusion/v1/datasheets/{datasheetId}/records

### Request samples

*   cURL
*   JavaScript SDK

Copy

curl \-X DELETE \\
"https://aitable.ai/fusion/v1/datasheets/{Replace yours datasheetId}/records?recordIds={Replace with the one you want to delete recordId}" \\
\-H  "Authorization: Bearer {Replace your API Token}"

### Response samples

*   200

Content type

application/json

Copy

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": true       }`

# [](#tag/Field)Field

The data structure of the fields is as follows.

Properties

Description

id

`string`, field ID

Example values: `fldsRHWJZwFcM`

name

`string`, field name

Example values: `Order number`

type

`string`, Field types, possible values are listed in the section [Field Types and Attributes](#field-types-and-attributes)

Example values: `SingleText`

editable

`boolean`, Field permissions, i.e. [column permissions](https://help.aitable.ai/docs/guide/manual-field-permission), `true` for editable, `false` for read-only

Example values: `true`

property

`object`,Field attributes.Different fields have different attributes, see the section [Field Types and Attributes](#field-types-and-attributes) for details on the attributes of various fields

Example values: `{"defaultValue":"To be added"}`

isPrimary

`boolean`, Is the primary field

Example values: `true`

desc

`string`, Field descriptions, i.e. column descriptions

Example values: `This column is the automatic generation of the single number, do not manually modify`

### Field Types and Attributes

AITable currently has the following field types.

The type of field returned by the interface

The type of the corresponding field

SingleText

single-line text

Text

Multi-line text

SingleSelect

Single choice

MultiSelect

Multiple choice

Number

Number

Currency

Currency

Percent

Percentage

DateTime

Datetime

Attachment

Attachment

Member

Member

Checkbox

Check

Rating

Rating

URL

Website

Phone

A telephone number.

Email

Email

WorkDoc

WorkDoc

OneWayLink

One-way link

TwoWayLink

Two-way link

MagicLookUp

MagicLookUp

Formula

Intelligent formula

AutoNumber

Autoincrement number

CreatedTime

Create Timestamp

LastModifiedTime

Modify Timestamp

CreatedBy

Created by

LastModifiedBy

Updated by

Button

Button

The following section describes the properties of each field type in detail.

When the "Get Field" interface is called, the following results are returned for each field type.

#### SingleText

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "SingleText",
  "property": {
    "defaultValue": ""
  }
}
```

Field Properties

Data Type

Description

defaultValue

string

When creating a new record, the default value of the corresponding cell of this field, the default is empty

#### Text

No field properties are available at this time.

#### SingleSelect

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "SingleSelect",
  "property": {
    "options": [
      {
        "id": "optpTVSGk0R2M",
        "name": "Elevit",
        "color": {
          "name": "indigo_4",
          "value": "#5586FF"
        }
      },
      {
        "id": "optqX2Bw479FG",
        "name": "OAD",
        "color": {
          "name": "blue_4",
          "value": "#55CDFF"
        }
      }
    ]
  }
}
```

Field Properties

Data Type

Description

options

object arrays

List of all available options

Description of the parameters contained under options.

Parameters

Data Type

Description

id

string

option ID

name

string

option name

color

object

The color of the option, including the name and value of the color

#### MultiSelect

The field properties are the same as the radio selection.

#### Number

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "Number",
  "property": {
    "defaultValue": "2",
    "precision": 0,
    "commaStyle": ",",
    "symbol": "Square meters"
  }
}
```

Field Properties

Data Type

Description

defaultValue

string

The default value for this field when creating a new record, default is empty.

precision

number

Indicates the number of decimal places, i.e., the precision of the number.The values are 0 (for integers), 1 (to one decimal place), 2 (to two decimal places), 3 (to three decimal places), 4 (to four decimal places)

commaStyle

string

Thousand separator, set this property to separate thousands of digits by a comma, such as 1,000.default is empty (optional)

symbol

string

numeric units, displayed to the right of the number, default is null (optional)

#### Currency

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "Currency",
  "property": {
    "defaultValue": "1000.00",
    "precision": 2,
    "symbol": "¥",
    "symbolAlign": "Default"
  }
}
```

Field Properties

Data Type

Description

defaultValue

string

The default value for this field when creating a new record, the default is null.

precision

number

Indicates the number of decimal places, i.e., the precision of the number.The values are 0 (for integers), 1 (to one decimal place), 2 (to two decimal places), 3 (to three decimal places), 4 (to four decimal places)

symbol

string

currency symbol, can be any custom character

symbolAlign

string

currency symbol (optional).The default value is `Default` (the currency unit is immediately to the left of the value), other values are `Left` (the currency unit is fixed to the left), `Right` (the currency unit is fixed to the right).

#### Percent

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "Percent",
  "property": {
    "defaultValue": "0.85",
    "precision": 1
  }
}
```

Field Properties

Data Type

Description

defaultValue

string

The default value of the cell corresponding to this field when creating a new record, the default is empty.

precision

number

Indicates the number of decimal places to convert the field value to a percentage, i.e., the percentage precision.The values are 0 (for integers), 1 (to one decimal place), 2 (to two decimal places), 3 (to three decimal places), 4 (to four decimal places).For example, if the field value is 0.22, it will be displayed as 22% if the percentage precision is 0. If the percentage precision is 1, it will be displayed as 22.0%

#### Datetime

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "DateTime",
  "property": {
    "dateFormat": "YYYY/MM/DD hh:mm",
    "includeTime": true,
    "timeFormat": "hh:mm",
    "autoFill": true,
    "timeZone": "Asia/Hongkong",
    "includeTimeZone": true
  }
}
```

Field Properties

Data Type

Description

dateFormat

string(enum)\*

YYYY/MM/DD, YYYY-MM-DD, DD/MM/YYYY, YYYY-MM, MM-DD, YYYY, MM, DD

includeTime

Boolean

Whether to display the time

timeFormat

string(enum)

HH:mm, hh:mm

autoFill

Boolean

Whether to auto-fill the time when creating a new record

timeZone

String

Time zone

includeTimeZone

Boolean

Whether to display time zone

The value of the date field returns timestamp without restricted format.The `format` information in the field property can be used for formatting, see [dayjs format](https://day.js.org/docs/en/display/format#list-of-all-available-formats) for the meaning.

_If you don't want to handle date formatting and want the returned result to be consistent with the view display, you can assign [`cellFormat`](#operation/get-records) to `string` in the interface request parameters, and all the returned content will be a string._

For available values for `timeZone` property, please refer to [List of Time Zones](https://timezonedb.com/time-zones). Example: `Asia/Shanghai`。

#### Attachment

No field properties are available at this time.

#### Member

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "Member",
  "property": {
    "isMulti": true,
    "shouldSendMsg": true
  }
}
```

Field Properties

Data Type

Description

isMulti

Boolean

If or not multiple members can be selected

shouldSendMsg

Boolean

Whether to send an in-site message to a member when it is mentioned in the member column

Description of the parameters contained under options.

Parameters

Data Type

Description

id

String

The user's organizational unit id (different from the actual user id) on the current space, hereafter referred to as the member id. e. g.Bob's member id on space A is different from his member id on space B

name

String

member name

type

String

member type, including `Member` (for users with physical accounts) and `Team` (for organizational units in the space, such as departments, groups, etc.)

avatar

String

URL of the member's avatar

#### Checkbox

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "Checkbox",
  "property": {
    "icon": "white_check_mark"
  }
}
```

Field Properties

Data Type

Description

icon

string(enum)

Please refer to [Expression Pack Enumeration](/widget/emojis)

#### Rating

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "Rating",
  "property": {
    "icon": "star",
    "max": 5
  }
}
```

Field Properties

Data Type

Description

icon

string(enum)

Please refer to [Expression Pack Enumeration](/widget/emojis)

max

Number

The maximum value of the rating, from 1-10

#### URL

No field properties are available at this time.

#### Phone

No field properties are available at this time.

#### Email

No field properties are available at this time.

#### WorkDoc

No field properties are available at this time.

#### OneWayLink

Two datasheets A and B are connected by a link field, and there will be an association field in A that is associated with B.

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "OneWayLink",
  "property": {
    "foreignDatasheetId": "dstgr2YN264s7CXKVs",
    "limitToViewId": "viwY4B8pmiMoi",
    "limitSingleRecord": true
  }
}
```

Field Properties

Data Type

Description

foreignDatasheetId

String

Related datasheet ID

limitSingleRecord

Boolean

Whether to select only a single record

limitToViewId

String

Specifies a view of the associated datasheet, limiting the selection to the records under that view

#### TwoWayLink

Two datasheets A and B are connected by a link field, and there will be an association field in A that is associated with B, and a link field in B that is associated with A.This pair of related fields is called a `brother field`.

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "TwoWayLink",
  "property": {
    "foreignDatasheetId": "dstgr2YN264s7CXKVs",
    "brotherFieldId": "fldxxxxxxxx",
    "limitToViewId": "viwY4B8pmiMoi",
    "limitSingleRecord": true
  }
}
```

Field Properties

Data Type

Description

foreignDatasheetId

String

Related datasheet ID

brotherFieldId

String

Related field ID

limitSingleRecord

Boolean

Whether to select only a single record

limitToViewId

String

Specifies a view of the associated datasheet, limiting the selection to the records under that view

#### MagicLookUp

The MagicLookUp field is a field attached to a OneWayLink or TwoWayLink field. It is a dynamic computed field, and the cell itself does not store any value.

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "MagicLookUp",
  "property": {
    "relatedLinkFieldId": "fldhBGpM3ylTq",
    "targetFieldId": "fldS2mgS18LE1",
    "rollupFunction": "VALUES",
    "valueType": "Array",
    "entityField": {
      "datasheetId": "dstgr2YN264s7CXKVs",
      "field": {
        "id": "fldS2mgS18LE1",
        "name": "title",
        "type": "SingleText",
        "property": {
          "defaultValue": ""
        },
        "editable": true
      }
    },
    "enableFilterSort": true,
    "sortInfo": {
      "rules": [
        {
          "fieldId": "fld7aautAK1h",
          "desc": false
        }
      ]
    },
    "filterInfo": {
      "conjunction": "and",
      "conditions": [
        {
          "fieldId": "fldL74kjFHak",
          "fieldType": "Number",
          "operator": "isGreater",
          "value": [13]
        }
      ]
    },
    "lookUpLimit": "ALL"
  }
}
```

Field Properties

Data Type

Description

relatedLinkFieldId

String

The associated field ID of the referenced current datasheet

targetFieldId

String

the field ID of the queried field in the associated datasheet

hasError

Boolean

When a lookup dependent associated field is deleted or converted, the referenced value may not be retrieved properly

entityField

Object

The entity fields are finally referenced, excluding MagicLoopUp fields.If an error exists, the entity field may not exist.

rollupFunction

String

aggregate function

valueType

String

Return value type, including `String`, `Boolean`, `Number`, `DateTime`, `Array`

format

Object

Returns the result of a number or date formatting operation when the return value is of type `Number` or `DateTime`

*   Description of the `rollupFunction` values refer to [Lookup Product Manual](https://help.aitable.ai/docs/guide/manual-field-lookup) for the meaning of the parameters.
    
    Function Name
    
    Return Value Type
    
    Description
    
    VALUES
    
    array
    
    Original values
    
    AVERAGE
    
    number
    
    average
    
    COUNT
    
    number
    
    non-null count
    
    COUNTA
    
    number
    
    non-null value count
    
    COUNTALL
    
    number
    
    full count
    
    SUM
    
    number
    
    Total
    
    MIN
    
    number/datetime
    
    minimum
    
    MAX
    
    number/datetime
    
    maximum
    
    AND
    
    boolean
    
    and operation
    
    OR
    
    boolean
    
    or operation
    
    XOR
    
    boolean
    
    eXclusive OR operation
    
    CONCATENATE
    
    string
    
    concatenate to text
    
    ARRAYJOIN
    
    string
    
    comma-join
    
    ARRAYUNIQUE
    
    array
    
    Deduplication
    
    ARRAYCOMPACT
    
    array
    
    filter all null values
    
*   Description of the parameters contained under `entityField`.
    
    Parameters
    
    Data Type
    
    Description
    
    datasheetId
    
    String
    
    the datasheet ID of the entity field
    
    field
    
    Object
    
    A `Field` object other than LookUp, a MagicLookUp can refer to a field of a MagicLookUp type from another datasheet, but ultimately an entity field will exist.
    
    > Note: If you use this field feature in your application, you will need to handle exceptions when a reference error is detected for the field.
    
*   The parameters included under `format` are described below.
    
    Parameters
    
    Data Type
    
    Description
    
    type
    
    String
    
    formatting type `DateTime`, `Number`, `Percent`, `Currency`
    
    format
    
    Object
    
    The specific format of the different formatting types
    
    **Formatted as date.**
    
    Parameters
    
    Data Type
    
    Description
    
    dateFormat
    
    String
    
    Date format, e.g. `YYYY/MM/DD`
    
    timeFormat
    
    String
    
    Time format, e.g. `hh:mm`, `HH:mm`
    
    includeTime
    
    Boolean
    
    Whether to display the time
    
    timeZone
    
    String
    
    Time zone
    
    includeTimeZone
    
    Boolean
    
    Whether to display time zone
    
    **Formatted as a number or percentage:**
    
    Parameters
    
    Data Type
    
    Description
    
    precision
    
    Number
    
    numeric precision or percentage precision
    
    **Formatted as currency:**
    
    Parameters
    
    Data Type
    
    Description
    
    precision
    
    Number
    
    Precision
    
    symbol
    
    String
    
    currency symbol
    
*   Explanation of parameters contained in `sortInfo`:
    
    Parameters
    
    Data Type
    
    Description
    
    rules
    
    array
    
    An array of sorting rules. Currently, only one sorting rule can be specified (the array can only have one element).
    
    Explanation of parameters contained in the `rules` array:
    
    Parameters
    
    Data Type
    
    Description
    
    fieldId
    
    string
    
    The ID of the field used for sorting.
    
    desc
    
    boolean
    
    Whether to sort in descending order.
    
*   Explanation of parameters contained in `filterInfo`:
    
    Parameters
    
    Data Type
    
    Description
    
    conjunction
    
    string
    
    Combination mode of filter conditions: `and` requires all filter conditions to be met; `or` requires any one filter condition to be met.
    
    conditions
    
    array
    
    Array of filter conditions
    
    Explanation of parameters contained in `conditions`:
    
    Parameters
    
    Data Type
    
    Description
    
    fieldId
    
    string
    
    Field ID of the filter field
    
    fieldType
    
    string
    
    Field type of the filter field
    
    operator
    
    string
    
    Operator of the filter condition. See the table below for available values.
    
    value
    
    array
    
    Reference value of the filter condition. For example, if the filter condition is "greater than 3", the reference value is 3, and the value would be `[3]`.
    
    Explanation of possible values for `operator`:
    
    Value
    
    Description
    
    is
    
    Filters the field whose value is equal to the reference value
    
    isNot
    
    Filters the field whose value is not equal to the reference value
    
    contains
    
    Filters the field whose value contains the reference value
    
    doesNotContain
    
    Filters the field whose value does not contain the reference value
    
    isEmpty
    
    Filters the field whose value is empty
    
    isNotEmpty
    
    Filters the field whose value is not empty
    
    isGreater
    
    Filters the field whose value is greater than the reference value
    
    isGreaterEqual
    
    Filters the field whose value is greater than or equal to the reference value
    
    isLess
    
    Filters the field whose value is less than the reference value
    
    isLessEqual
    
    Filters the field whose value is less than or equal to the reference value
    
    isRepeat
    
    Filters the field whose value contains duplicate items
    
*   Explanation of possible values for `lookUpLimit`:
    
    Value
    
    Description
    
    ALL
    
    Displays all referenced record values.
    
    FIRST
    
    Displays only the first referenced record value.
    

#### Formula

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "Formula",
  "property": {
    "expression": "",
    "valueType": "String",
    "hasError": false
  }
}
```

Field Properties

Data Type

Description

expression

string\*

formula expression

valueType

string(enum)\*

Return value type, including `String`, `Boolean`, `Number`, `DateTime`, `Array`

hasError

boolean

The calculated value may not be retrieved properly when the relevant field dependent on the formula is deleted or converted.

format

object

When the return value is of type `Number` or `DateTime`, it returns a number or date formatted in the same format as the lookup.

Same as magiclookup, exceptions need to be handled when errors are encountered.

#### AutoNumber

DescriptionNo field properties are available at this time.

#### CreatedTime

Same as DateTime.

#### LastModifiedTime

Same as DateTime.

#### CreatedBy

The member id is at the space level and the creator id is at the account level.

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "CreatedBy",
  "property": {
    "options": [
      {
        "id": "e9cbc839fd1b49be85b1f7b0977047e2",
        "name": "Coco",
        "avatar": "https://s1.aitable.ai/default/avatar004.jpg"
      }
    ]
  }
}
```

Field Properties

Data Type

Description

options

option\[\]

Members whose fields have been selected by the current member

Description of the parameters contained under options.

Parameters

Data Type

Description

id

string\*

user id

name

string\*

user nickname

avatar

string\*

URL of user avatar

#### LastModifiedBy

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "type": "LastModifiedBy",
  "property": {
    "options": [
      {
        "id": "e9cbc839fd1b49be85b1f7b0977047e2",
        "name": "Coco",
        "avatar": "https://s1.aitable.ai/default/avatar004.jpg"
      }
    ]
  }
}
```

Field Properties

Data Type

Description

options

option\[\]

Current field stored users

Description of the parameters contained under options.

Parameters

Data Type

Description

id

string\*

user id

name

string\*

user nickname

avatar

string\*

URL of user avatar

#### Button

Return a sample fragment of the result (containing only field types and attributes).

```json
{
  "id": "fldb6L4FznMbZ",
  "name": "Button",
  "type": "Button",
  "property": {
    "text": "Click to start",
    "style": {
      "type": "Background",
      "color": {
        "name": "deepPurple_5",
        "value": "#B0A4F5"
      }
    },
    "action": {
      "type": "openLink",
      "openLink": {
        "type": "Url",
        "expression": "https://aitable.ai"
      }
    }
  },
  "editable": false
}
```

Field Properties

Data Type

Description

text

String

Button text

style

Object

Button style

action

Object

Button action

*   Explanation of parameters contained in `style`:

Parameters

Data Type

Description

type

String

Button style type: Background, OnlyText. \\n Default is Background

color

Object

Button style color

*   Explanation of parameters contained in `color`:

Parameters

Data Type

Description

name

String

Color name, see the name of [color value list](/widget/colors) for details

value

String

Color value, not required. See the name of [color value list](/widget/colors) for details

*   Explanation of parameters contained in `action`:

Parameters

Data Type

Description

type

String

Button action type: `OpenLink`, `TriggerAutomation`. Currently only `OpenLink` support for now in the API

openLink

Object

Click to open a link

*   Explanation of parameters contained in `openLink`:

Parameters

Data Type

Description

type

String

Link type: Url, Expression

expression

String

Pure url or The expression of the url

## [](#tag/Field/operation/get-fields)Get Field

This interface is used to get information about all fields in the specified datasheet that you have permission to view.

A maximum of 200 fields can be created in a single datasheet.Requests for fields return the results in a single pass, without paging.

*   Request address: [https://aitable.ai/fusion/v1/datasheets/{datasheetId}/fields](https://aitable.ai/fusion/v1/datasheets/%7BdatasheetId%7D/fields)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {your API Token}`

Example requests for cURL, Javascript SDK are provided in the area on the right for your reference.

> If you need more detailed operation instructions, you can read the [Get Fields](/api/get-fields) operation guide of the "API Guide".

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

datasheetId

required

string

Example: dst0Yj5aNeoHldqvf6

AITable Datasheet ID

##### query Parameters

viewId

string

Example: viewId=viwG9l1VPD6nH

View ID. If you specify a view, the returned fields are in the same order as the view. Hidden fields will not be returned.

### Responses

**200**

get/fusion/v1/datasheets/{datasheetId}/fields

AITable API server address

https://aitable.ai/fusion/v1/datasheets/{datasheetId}/fields

### Request samples

*   cURL
*   JavaScript SDK
*   Python SDK

Copy

curl \-X GET \\
"https://aitable.ai/fusion/v1/datasheets/{Replace with yours datasheetId}/fields" \\
\-H "Authorization: Bearer {Replace your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "fields": [                  *   {                          *   "id": "fidV3ElniQavTNyJG",                              *   "name": "Title",                              *   "type": "SingleText",                              *   "desc": "desc",                              *   "property": {                                  *   "defaultValue": "To be supplemented"                                                       }                                           }                               ]                   }       }`

## [](#tag/Field/operation/create-fields)Create Field

This interface is used to create new fields in the specified datasheet.A maximum of 200 fields can be created in a single datasheet.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/datasheets/{datasheetId}/fields](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/datasheets/%7BdatasheetId%7D/fields)
*   Request method: `POST`
*   The request header must contain.
    *   `Authorization: Bearer {your API Token}`
    *   `Content-Type: application/json`

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

datasheetId

required

string

Example: dstNiC6R9MryevVaCQ

Datasheet ID

##### Request Body schema: application/json

Request body structure

type

required

string

Field Type

SingleTextTextSingleSelectMultiSelectNumberCurrencyPercentDateTimeAttachmentMemberCheckboxRatingURLPhoneEmailWorkDocOneWayLinkTwoWayLinkMagicLookUpFormulaAutoNumberCreatedTimeLastModifiedTimeCreatedByLastModifiedByButtonSingleText

name

required

string

Field name, no more than 100 characters

property

required

object

Single line text attribute

### Responses

**200**

post/fusion/v1/spaces/{spaceId}/datasheets/{datasheetId}/fields

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/datasheets/{datasheetId}/fields

### Request samples

*   Payload
*   cURL
*   JavaScript SDK
*   Python SDK

Content type

application/json

Example

SingleTextTextSingleSelectMultiSelectNumberCurrencyPercentDateTimeAttachmentMemberCheckboxRatingURLPhoneEmailWorkDocOneWayLinkTwoWayLinkMagicLookUpFormulaAutoNumberCreatedTimeLastModifiedTimeCreatedByLastModifiedByButtonSingleText

Copy

Expand all Collapse all

`{  *   "type": "SingleText",      *   "name": "Title",      *   "property": {          *   "defaultValue": "Default text text"                   }       }`

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "id": "fldupsvkR2ATB",              *   "name": "Title"                   }       }`

## [](#tag/Field/operation/delete-fields)Delete Field

This interface is used to delete fields in the specified datasheet.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/datasheets/{datasheetId}/fields/{fieldId}](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/datasheets/%7BdatasheetId%7D/fields/%7BfieldId%7D)
*   Request method: `DELETE`
*   The request header must contain.
    *   `Authorization: Bearer {your API Token}`
    *   `Content-Type: application/json`

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

datasheetId

required

string

Example: dstNiC6R9MryevVaCQ

Datasheet ID

fieldId

required

string

Example: fld7r18G7eSOu

field ID, field ID can be obtained through the field interface

### Responses

**200**

delete/fusion/v1/spaces/{spaceId}/datasheets/{datasheetId}/fields/{fieldId}

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/datasheets/{datasheetId}/fields/{fieldId}

### Request samples

*   cURL
*   JavaScript SDK
*   Python SDK

Copy

curl \-X DELETE \\
"https://aitable.ai/fusion/v1/spaces/spcjXzqVrjaP3/datasheets/dstNiC6R9MryevVaCQ/fields/fldxxxxxx" \\
\-H "Authorization: Bearer {Your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": { }       }`

# [](#tag/View)View

The data structure of view is as follows.

Attributes

Description

id

string\*  
ID of view  
e.g. `viwpdA8TUBp5r`

name

string\*  
Name of view  
e.g. `All Orders`

type

string(enum)\*  
`Grid`, `Gallery`, `Kanban`, `Gantt`, `Calendar`, `Architecture`  
e.g. `Grid`

## [](#tag/View/operation/get-views)Get View

This interface is used to fetch all views of the specified datasheet.

The request to fetch the views returns the results in one go, without paging.

*   Request address: [https://aitable.ai/fusion/v1/datasheets/{datasheetId}/views](https://aitable.ai/fusion/v1/datasheets/%7BdatasheetId%7D/views)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {your API Token}`

Example requests for cURL, Javascript SDK are provided in the area on the right for your reference.

> If you need a more detailed operation guide, you can read the [Get Views](/api/get-views) operation guide in the "API Guide".

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

datasheetId

required

string

Example: dst0Yj5aNeoHldqvf6

AITable Datasheet ID

### Responses

**200**

get/fusion/v1/datasheets/{datasheetId}/views

AITable API server address

https://aitable.ai/fusion/v1/datasheets/{datasheetId}/views

### Request samples

*   cURL
*   JavaScript SDK

Copy

curl \-X GET \\
"https://aitable.ai/fusion/v1/datasheets/{Replace with yours datasheetId}/views" \\
\-H "Authorization: Bearer {Replace your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "views": [                  *   {                          *   "id": "viwpdA8TUBp5r",                              *   "name": "Order completed",                              *   "type": "Grid"                                           }                               ]                   }       }`

# [](#tag/Datasheet)Datasheet

At the moment, only the interface for creating tables is open for AITable.

## [](#tag/Datasheet/operation/create-datasheets)Create Datasheet

This interface is used to create a datasheet with the specified fields in the specified space.A maximum of 200 fields can be created in a single request in a newly created datasheet.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/datasheets](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/datasheets)
*   Request method: `POST`
*   The request header must contain.
    *   `Authorization: Bearer {your API Token}`
    *   `Content-Type: application/json`

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

##### Request Body schema: application/json

Request body structure

name

required

string

Datasheet name, no more than 100 characters

description

string

Table description, no more than 500 characters

folderId

string

The folder ID; if it is blank, it will be the working directory by default

preNodeId

string

The ID of the previous node. If it is empty, it will be moved to the first place

fields

Array of objects (FieldItemRo)

Field list. If it is blank, 3 columns of default fields will be added

### Responses

**200**

post/fusion/v1/spaces/{spaceId}/datasheets

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/datasheets

### Request samples

*   Payload
*   cURL
*   JavaScript SDK
*   Python SDK

Content type

application/json

Copy

Expand all Collapse all

`{  *   "name": "My Datasheet",      *   "description": "This is a description",      *   "folderId": "fodn173Q0e8nC",      *   "preNodeId": "dstQJl6BGku1WfLPTD",      *   "fields": [          *   {                  *   "type": "Text",                      *   "name": "Title"                               }                   ]       }`

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "id": "dstbs2U7mt8AEqgKuh",              *   "createdAt": 1648648690000,              *   "fields": [                  *   {                          *   "id": "fldupsvkR2ATB",                              *   "name": "Title"                                           }                               ]                   }       }`

# [](#tag/Attachment)Attachment

Currently the AITable is only open for uploading attachments.

## [](#tag/Attachment/operation/upload-attachments)Upload Attachment

This interface is used to upload an attachment and bind the attachment to a datasheet.

After uploading the attachment, the attachment data is not directly inserted into the datasheet. Instead, it needs to be inserted into a field of type attachment by using either the `Create records` or `Update records` API.

Only one attachment can be uploaded per request.If you need to upload multiple files, you need to call this interface repeatedly.

*   Request address: [https://aitable.ai/fusion/v1/datasheets/{datasheetId}/attachments](https://aitable.ai/fusion/v1/datasheets/%7BdatasheetId%7D/attachments)
*   Request method: `POST`
*   The request header must contain.
    *   `Authorization: Bearer {your API Token}`
    *   `Content-Type: multipart/form-data`

Example requests for cURL, Javascript SDK are provided in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [Upload Attachments](/api/upload-attachments) operation guidance in the "API Guide".

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

datasheetId

required

string

Example: dst0Yj5aNeoHldqvf6

AITable Datasheet ID

##### Request Body schema: multipart/form-data

Request body structure

file

required

string <binary>

The local absolute path of the attachment to be uploaded.

### Responses

**201**

post/fusion/v1/datasheets/{datasheetId}/attachments

AITable API server address

https://aitable.ai/fusion/v1/datasheets/{datasheetId}/attachments

### Request samples

*   cURL
*   JavaScript SDK

Copy

curl \-X POST \\
"https://aitable.ai/fusion/v1/datasheets/{Replace with yours datasheetId}/attachments" \\
\-H  "Authorization: Bearer {Replace your API Token}" \\
\-H  "Content-Type: multipart/form-data" \\
\-F "file=@{Replace with your local file path}"

### Response samples

*   201

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "token": "space/2020/07/28/6fdc652231a8480398e302606ae28213",              *   "name": "9d4911932181f254433a86b05797f9a6.jpeg",              *   "size": 7194,              *   "width": 479,              *   "height": 478,              *   "mimeType": "image/jpeg",              *   "preview": "***",              *   "url": "***"                   }       }`

# [](#tag/Space)Space

The data structure of space is as follows.

Attributes

Description

id

string\*  
ID of space  
e.g. `spcX9P2xUcKst`

name

string\*  
Name of space  
e.g. `test space`

isAdmin

boolean  
whether the current requesting user is the admin of the space  
e.g. `true`

## [](#tag/Space/operation/get-spaces)Get the List of Spaces

This interface is used to get all spaces created or invited to by the current requesting user.

*   Request address: [https://aitable.ai/fusion/v1/spaces](https://aitable.ai/fusion/v1/spaces)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {your API Token}`

Example requests for cURL, Javascript SDK are provided in the area on the right for your reference.

> If you need more detailed operation instructions, you can read the [Get List of Spaces](/api/get-spaces) operation guide in the "API Guide".

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

### Responses

**200**

get/fusion/v1/spaces

AITable API server address

https://aitable.ai/fusion/v1/spaces

### Request samples

*   cURL
*   JavaScript SDK

Copy

curl \-X GET \\
"https://aitable.ai/fusion/v1/spaces" \\
\-H "Authorization: Bearer {Replace your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "spaces": [                  *   {                          *   "id": "spczdmQDfBAn5",                              *   "name": "AITable No.1",                              *   "isAdmin": true                                           }                               ]                   }       }`

# [](#tag/Node)Node

The data structure of single file node is as follows.

Attributes

Description

id

string\*  
ID of file node  
e.g. `fodvfSPGFPmFH`

name

string\*  
Name of file node  
e.g. `R&D Department`

icon

string  
Icon of file node  
e.g. 🤠

type

string(enum)\*  
`Datasheet`, `Mirror`, `Folder`, `Form`, `Dashboard`, `Automation`  
e.g. `Folder`

isFav

boolean  
Pin status. This parameter indicates whether the current node is pinned to the "Pin" section in the left sidebar  
e.g. `true`

permission

number  
API tokens are generated based on individual accounts. Users can retrieve a list of file nodes that they have specific permissions for using the API token..  
`0`: Manager, able to add, delete views and records field, and allowed to edit fields, but nable to add and delete fields.  
`1`: Editor, able to add, delete views and records field, and allowed to edit fields, but unable to add and delete fields.  
`2`: Update-only, able to view, add and edit records, but unable to delete records.  
`3`: Read-only, only allowed to view the data.  
For more details about file node permissions can be found here: [https://help.aitable.ai/docs/guide/faq-permission-settings](https://help.aitable.ai/docs/guide/faq-permission-settings)  
e.g. `0`

children

array of nodes  
**Only returned when [Get Node Details](get-node-details) is requested**。The `children` information will only be returned when the file type is `Folder`. Under `children`, there is a list of file nodes in the folder one level down.  
e.g. `[{"id":"fodwrbgo8lDpbUjZzm","name":"Procurement management","type":"Folder","icon":"🤠","isFav":true},{"id":"fodwrbgo8lDpbUjZzm","name":"Procurement management","type":"Folder","icon":"🤠","isFav":true}]`

parentId

string  
**Only returned when requesting [Get Node List](get-nodes) and [Search Nodes](search-nodes).** Parent node ID. This attribute specifies the ID of the parent node for the current node. If the node does not have a parent node, then this attribute is not returned  
e.g. `fodwrbgo8lDpbUjZzm`

## [](#tag/Node/operation/get-nodes)Get Node List

This interface is used to get a list of the outermost files in the working directory of a given space, which supports Fusion API v3 with a new data engine that provides better performance and a more efficient API experience, see [Fusion API v3](/api/fusion-api-v3) for details.

The "Get Node List" interface only supports returning the outermost list of files in the working directory. If you want to return a list of all nodes in the working directory, you can call both the \["Get Node details"\](get-node-details#example: get a list of files and details under a specified folder) interface to do so.

Possible file types to be fetched include datasheets, folders, forms, dashboards, automations, etc.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/nodes](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/nodes)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {your API Token}`

Example requests for cURL, Javascript SDK are provided in the area on the right for your reference.

> If you need more detailed operation instructions, you can read the [Get Node List](/api/get-nodes) operation guide of the "API Guide".

##### path Parameters

spaceId

required

string

Example: spczdmQDfBAn5

Space ID

### Responses

**200**

get/fusion/v1/spaces/{spaceId}/nodes

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/nodes

### Request samples

*   cURL
*   JavaScript SDK

Copy

curl \-X GET \\
"https://aitable.ai/fusion/v1/spaces/{Replace with yours spaceId}/nodes" \\
\-H  "Authorization: Bearer {Replace your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "nodes": [                  *   {                          *   "id": "fodwrbgo8lDpbUjZzm",                              *   "name": "Procurement management",                              *   "type": "Folder",                              *   "icon": "🤠",                              *   "isFav": true                                           }                               ]                   }       }`

## [](#tag/Node/operation/search-nodes)Search Nodes

This interface provides a way for users to retrieve file nodes based on specific types, permissions, and queries, without having to consider the folder hierarchy.

The supported node types for retrieval include: Folder, Dashboard, Form, Dashboard, Mirror and Automation.

*   Request URL: [https://vika.cn/fusion/v2/spaces/{spaceId}/nodes](https://vika.cn/fusion/v2/spaces/%7BspaceId%7D/nodes)
*   Request method: `GET`
*   The request header must include: `Authorization: Bearer {your API Token}`

Example requests for cURL are provided in the area on the right for your reference.

> If you need more detailed operation instructions, you can read the [Search Nodes](/api/search-nodes) operation guide of the "API Guide".

##### path Parameters

spaceId

required

string

Example: spczdmQDfBAn5

Space ID

##### query Parameters

type

required

string

Enum: "Folder" "Datasheet" "Form" "Dashboard" "Mirror"

Example: type=Datasheet

The type of file node, value in ("Folder", "Datasheet", "Form", "Dashboard", "Mirror"). The values are case-sensitive.

permissions

Array of numbers

Default: \[0,1,2,3\]

Items Enum: 0 1 2 3

0: Manager, able to add, delete views and records field, and allowed to edit fields, but unable to add and delete fields.  
1: Editor, able to add, delete views and records field, and allowed to edit fields, but unable to add and delete fields.  
2: Update-only, able to view, add and edit records, but unable to delete records.  
3: Read-only, only allowed to view the data.  
By providing the permissions associated with their API token, users can retrieve all file nodes within their account that match those permissions. If this parameter is empty, return all accessible file nodes.  
For example, if you want to get all file nodes where records can be added, pass the parameter like this permissions=0,1,2  
For more details about file node permissions can be found here: [https://help.aitable.ai/docs/guide/faq-permission-settings](https://help.aitable.ai/docs/guide/faq-permission-settings)

query

string

This parameter enables searching for file nodes with specific keywords and returns a list of matching nodes based on partial name matches.

### Responses

**200**

get/fusion/v2/spaces/{spaceId}/nodes

AITable API server address

https://aitable.ai/fusion/v2/spaces/{spaceId}/nodes

### Request samples

*   cURL
*   JavaScript SDK
*   Python SDK

Copy

curl \-X GET \\
"https://aitable.ai/fusion/v2/spaces/{Replace with yours spaceId}/nodes?type=Datasheet" \\
\-H  "Authorization: Bearer {Replace your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "nodes": [                  *   {                          *   "id": "fodwrbgo8lDpbUjZzm",                              *   "name": "Procurement management",                              *   "type": "Folder",                              *   "icon": "🤠",                              *   "parentId": "fodEqT83BQPz3",                              *   "permission": 0,                              *   "isFav": true                                           }                               ]                   }       }`

## [](#tag/Node/operation/get-node-details)Get Node Details

This interface is used to get the details of the specified file in the working directory of the specified space.

Possible file types to be fetched include datasheets, folders, forms, dashboards, etc.

If the specified file type is a folder, it will get the list of the outermost files under that folder and their details; if the specified file is of other types, it will get the details of that file.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/nodes/{nodeId}](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/nodes/%7BnodeId%7D)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {your API Token}`

Example requests for cURL, Javascript SDK are provided in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [Get Node Details](/api/get-node-details) operation guidance in the "API Guide".

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spczdmQDfBAn5

Space ID

nodeId

required

string

Example: fodTXAYEmQ5rd

File node ID, such as AITable Datasheet ID, folder ID, collection table ID or dashboard ID

### Responses

**200**

get/fusion/v1/spaces/{spaceId}/nodes/{nodeId}

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/nodes/{nodeId}

### Request samples

*   cURL
*   JavaScript SDK

Copy

curl \-X GET \\
"https://aitable.ai/fusion/v1/spaces/{Replace with yours spaceId}/nodes/{Replace with yours nodeId}" \\
\-H  "Authorization: Bearer {Replace your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "id": "fodwrbgo8lDpbUjZzm",              *   "name": "Procurement management",              *   "type": "Folder",              *   "icon": "🤠",              *   "isFav": true,              *   "children": [ ]                   }       }`

## [](#tag/Node/operation/create-embedlinks)Create embedded links

This interface is used to create an "embed link" to a specified node, such as a datasheet or a dashboard. If all parameters in the payload have the same value, the generated linkId (the last string of the url path) is the same. If the parameter values of the payload are different, the generated linkId will also be different.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/nodes/%7BnodeId%7D/embedlinks)
*   Request method: `POST`
*   The request header must contain.
    *   `Authorization: Bearer {your API Token}`
    *   `Content-Type: application/json`

> If you need more detailed instructions, you can read the [Create Embedded Links](/api/create-embedlinks) instructions in the API Guide.

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

nodeId

required

string

Example: dstS94qPZFXjC1LKns

Node ID, support Datasheet, Dashboard and Form

##### Request Body schema: application/json

payload

object (EmbedLinkPayloadDto)

theme

string

(This attribute is temporarily closed) The default value is light, theme color, dark | light

### Responses

**201**

Success

post/fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks

### Request samples

*   Payload
*   cURL
*   JavaScript SDK
*   Python SDK

Content type

application/json

Copy

Expand all Collapse all

`{  *   "payload": {          *   "primarySideBar": {                  *   "collapsed": true                               },              *   "viewControl": {                  *   "viewId": "string",                      *   "tabBar": true,                      *   "toolBar": {                          *   "basicTools": true,                              *   "widgetBtn": true,                              *   "apiBtn": true,                              *   "formBtn": true,                              *   "historyBtn": true,                              *   "robotBtn": true,                              *   "addWidgetBtn": true,                              *   "fullScreenBtn": true,                              *   "formSettingBtn": true                                           },                      *   "collapsed": true,                      *   "nodeInfoBar": true,                      *   "collaboratorStatusBar": true                               },              *   "bannerLogo": true,              *   "permissionType": "string"                   },      *   "theme": "string"       }`

### Response samples

*   201

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "payload": {                  *   "primarySideBar": {                          *   "collapsed": true                                           },                      *   "viewControl": {                          *   "viewId": "string",                              *   "tabBar": true,                              *   "toolBar": {                                  *   "basicTools": true,                                      *   "widgetBtn": true,                                      *   "apiBtn": true,                                      *   "formBtn": true,                                      *   "historyBtn": true,                                      *   "robotBtn": true,                                      *   "addWidgetBtn": true,                                      *   "fullScreenBtn": true,                                      *   "formSettingBtn": true                                                       },                              *   "collapsed": true,                              *   "nodeInfoBar": true,                              *   "collaboratorStatusBar": true                                           },                      *   "bannerLogo": true,                      *   "permissionType": "string"                               },              *   "theme": "string",              *   "linkId": "string",              *   "url": "string"                   }       }`

## [](#tag/Node/operation/get-embedlinks)Get list of embedded links

This interface is used to get a list of embedded links for the specified node(deleted embedded links are not returned), such as a datasheet or a dashboard.

A datasheet can create up to 30 embedded links. The result is returned once upon request, without pagination.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/nodes/%7BnodeId%7D/embedlinks)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {your API Token}`

The right area provides an example of a cURL request for your reference.

> If you need more detailed operation instructions, you can read the [Get Embedded Links List](/api/get-embedlinks) operation guide in the "API Guide".

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

nodeId

required

string

Example: dstS94qPZFXjC1LKns

Node ID

### Responses

**200**

Success

get/fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks

### Request samples

*   cURL
*   JavaScript SDK
*   Python SDK

Copy

curl \-X GET 'https://aitable.ai/fusion/v1/spaces/spcjXzqVrjaP3/nodes/dstWUHwzTHd2YQaXEE/embedlinks' \\
\-H 'Authorization: Bearer {Replace your API Token}'

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": [          *   {                  *   "payload": {                          *   "primarySideBar": {                                  *   "collapsed": true                                                       },                              *   "viewControl": {                                  *   "viewId": "string",                                      *   "tabBar": true,                                      *   "toolBar": {                                          *   "basicTools": true,                                              *   "widgetBtn": true,                                              *   "apiBtn": true,                                              *   "formBtn": true,                                              *   "historyBtn": true,                                              *   "robotBtn": true,                                              *   "addWidgetBtn": true,                                              *   "fullScreenBtn": true,                                              *   "formSettingBtn": true                                                                   },                                      *   "collapsed": true,                                      *   "nodeInfoBar": true,                                      *   "collaboratorStatusBar": true                                                       },                              *   "bannerLogo": true,                              *   "permissionType": "string"                                           },                      *   "theme": "string",                      *   "linkId": "string",                      *   "url": "string"                               }                   ]       }`

## [](#tag/Node/operation/delete-embedlinks)Delete embedded link

Disable the specified embed link. After deactivation, the link cannot be accessed.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks/{linkId}](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/nodes/%7BnodeId%7D/embedlinks/%7BlinkId%7D)
*   Request method: `DELETE`
*   The request header must contain.
    *   `Authorization: Bearer {your API Token}`

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

nodeId

required

string

Example: dstS94qPZFXjC1LKns

Node ID

linkId

required

string

Example: embb90a52cfc02a4f83

Embed Link ID

### Responses

**200**

Success

delete/fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks/{linkId}

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/nodes/{nodeId}/embedlinks/{linkId}

### Request samples

*   cURL
*   JavaScript SDK
*   Python SDK

Copy

curl \-X DELETE 'https://aitable.ai/fusion/v1/spaces/spcjXzqVrjaP3/nodes/dstWUHwzTHd2YQaXEE/embedlinks/embb90a52cfc02a4f83' \\
\-H 'Authorization: Bearer {Replace your API Token}'

### Response samples

*   200

Content type

application/json

Copy

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS"       }`

# [](#tag/AI)AI

Currently, the AITable only supports the chat completions API and is only available to whitelisted users. [Click here to apply](https://aitable.ai/share/shrD4HF7cDuruC2lhb2kb/fombCtvGjwZf9FgabN)

## [](#tag/AI/operation/create-chat-completions)Create chat completions

This interface is used to create chat completions.

*   Request address: [https://aitable.ai/fusion/v1/ai/{ai\_id}/chat/completions](https://aitable.ai/fusion/v1/ai/%7Bai_id%7D/chat/completions)
*   Request method: `POST`
*   Request header must contain:
    *   `Authorization: Bearer {Your API Token}`
    *   `Content-Type：application/json`

Example requests for cURL is in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [Create chat completions](/api/create-chat-completions).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

aiId

required

string

Example: ai\_zxLeHGV3ac32YYC

AI ID

##### Request Body schema: application/json

Request body structure

model

required

string

ID of the model to use, like "gpt-3.5-turbo". See the [Bot Model list](https://help.aitable.ai/docs/guide/manual/ai-agent#bot-model)

messages

required

Array of objects

A list of messages comprising the conversation so far.

functions

Array of AiFunction (object)

A list of functions the model may generate JSON inputs for.

function\_call

object

Controls how the model responds to function calls. "none" means the model does not call a function, and responds to the end-user. "auto" means the model can pick between an end-user or calling a function. Specifying a particular function via {"name":\\ "my\_function"} forces the model to call that function. "none" is the default when no functions are present. "auto" is the default if functions are present.

temperature

number \[ 0 .. 2 \]

What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

top\_p

number

An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top\_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

stream

boolean

If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data:\[DONE\] message.

stop

string/array/null

Up to 4 sequences where the API will stop generating further tokens.

max\_tokens

number

The maximum number of tokens to generate in the chat completion.

presence\_penalty

number \[ -2 .. 2 \]

Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.

frequency\_penalty

number \[ -2 .. 2 \]

Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.

user

string

A unique identifier representing your end-user, which can help us to monitor and detect abuse.

### Responses

**200**

Successfully

post/fusion/v1/ai/{aiId}/chat/completions

AITable API server address

https://aitable.ai/fusion/v1/ai/{aiId}/chat/completions

### Request samples

*   Payload
*   cURL
*   JavaScript SDK
*   Python SDK

Content type

application/json

Copy

Expand all Collapse all

`{  *   "model": "gpt-3.5-turbo",      *   "messages": [          *   {                  *   "role": "user",                      *   "content": "Hello!"                               }                   ],      *   "functions": [          *   {                  *   "name": "string",                      *   "description": "string",                      *   "parameters": { }                               }                   ],      *   "function_call": {          *   "name": "my_function"                   },      *   "temperature": 1,      *   "top_p": 1,      *   "stream": false,      *   "stop": null,      *   "max_tokens": 5,      *   "presence_penalty": 0,      *   "frequency_penalty": 0,      *   "user": "user123456"       }`

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "id": "aitable_ai_CkZH2zQokhry31j_1693452659",      *   "conversation_id": "CS-0253eb8d-d6c6-4543-88d4-fcb555f52982",      *   "actions": null,      *   "object": "chat.completion",      *   "created": 1693452659,      *   "model": "gpt-3.5-turbo",      *   "choices": [          *   {                  *   "index": 0,                      *   "message": {                          *   "role": "assistant",                              *   "content": "\n\nHello there, how may I assist you today"                                           },                      *   "finish_reason": "length"                               }                   ],      *   "usage": {          *   "prompt_tokens": 9,              *   "completion_tokens": 12,              *   "total_tokens": 21,              *   "total_cost": 21,              *   "result": "\n\nHello there, how may I assist you today"                   }       }`

# [](#tag/Member)Member

The data structure of the Member is as follows.

Properties

Type

Description

Example Value

unitId

string

Member's unitId

"T7fL3jV4KvX1cY2dGmS9sPqZzN6rWnB"

name

string

Member's name

"John"

avatar

string

The resource address for the member's avatar.

"[https://s1.aitable.ai/public/2023/05/16/00a91wbb47fd0594fbc975d2d764a45q"](https://s1.aitable.ai/public/2023/05/16/00a91wbb47fd0594fbc975d2d764a45q")

email

string

Member's email address

"[test@aitable.ai](mailto:test@aitable.ai)"

mobile

object

Member's phone number

`{"number": "12345678901","areaCode": "+86"}`

status

integer

Member's status, whether joined space (1:joined, 0:not joined)

1

type

string

Member's type ("PrimaryAdmin" indicates the Primary admin of the space, "SubAdmin" indicates the sub-admin of the space, "Member" indicates the member in the space )

"Member"

teams

array of object

Teams to which the member belongs.

`[{"unitId": "VS1SejiywaMWbiGMEHAohh62T9EPmmlh","name": "test","sequence": 1,"parentUnitId":"YN3YT97EPGL9ZA0loc9V2kNQnWb9ivKW"},...]`

roles

array of object

Roles associated with the member.

`[{"unitId": "sZ6gJ9L2HxP5XW1fRtNwE4zKqVcY7yM","name": "role A","sequence": 1},...]`

## [](#tag/Member/operation/get-a-member)Get a member

This interface is used to get the specified member's information.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/members/{unitId}](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/members/%7BunitId%7D)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {Your API Token}`

Example requests for cURL is in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [Get a member](/api/get-a-member).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

unitId

required

string

Example: kD8tPcZ3fYxSjV9qWvL5X2TmQbN1nR6

Member's unitId

##### query Parameters

sensitiveData

string

Example: sensitiveData=true

Fill in "true" to get sensitive member data such as phone number and email address.

### Responses

**200**

Successfully

get/fusion/v1/spaces/{spaceId}/members/{unitId}

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/members/{unitId}

### Request samples

*   cURL

Copy

curl \-X GET \\
'https://aitable.ai/fusion/v1/spaces/{spaceId}/members/{unitId}?sensitiveData=true' \\
\-H 'Authorization: Bearer {Your API Token}'

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "unitId": "kD8tPcZ3fYxSjV9qWvL5X2TmQbN1nR6",              *   "name": "John",              *   "email": "john@aitable.ai",              *   "avatar": "[https://s1.aitable.ai/public/2023/05/16/00a91wbb47fd0594fbc975d2d764a45q](https://s1.aitable.ai/public/2023/05/16/00a91wbb47fd0594fbc975d2d764a45q)",              *   "mobile": {                  *   "number": "13000111000",                      *   "areaCode": "+86"                               },              *   "status": 1,              *   "type": "PrimaryAdmin",              *   "teams": [                  *   {                          *   "unitId": "X9vJ6R2qFzL8sK1mVxZcPwNtY3gT5yD",                              *   "name": "Team A",                              *   "sequence": 1,                              *   "parentUnitId": "bD3fT4cL9wZ5mN8xSsK7qVvRjXhGpY",                              *   "roles": [                                  *   {                                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                                              *   "name": "Finance",                                              *   "sequence": 2001                                                                   }                                                       ]                                           }                               ],              *   "roles": [                  *   {                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                              *   "name": "Finance",                              *   "sequence": 2001                                           }                               ]                   }       }`

## [](#tag/Member/operation/update-a-member)Update a member

This interface is used to update a member.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/members/{unitId}](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/members/%7BunitId%7D)
*   Request method: `PUT`
*   Request header must contain:
    *   `Authorization: Bearer {Your API Token}`
    *   `Content-Type：application/json`

Example requests for cURL is in the area on the right for your reference.

The request body includes the properties and corresponding values to be updated in the member. Only the explicitly specified properties will be updated, while the properties that are not specified will retain their old values.

> If you need more detailed operation guidance, you can read the [Update a member](/api/update-a-member).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

unitId

required

string

Example: kD8tPcZ3fYxSjV9qWvL5X2TmQbN1nR6

Member's unitId

##### query Parameters

sensitiveData

string

Example: sensitiveData=true

Fill in "true" to get sensitive member data such as phone number and email address.

##### Request Body schema: application/json

Request body structure

name

string

Member's name

teams

Array of strings

The unitIds of teams to which the member belongs.

roles

Array of strings

The unitIds of roles associated with the member.

### Responses

**200**

Successfully

put/fusion/v1/spaces/{spaceId}/members/{unitId}

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/members/{unitId}

### Request samples

*   Payload
*   cURL

Content type

application/json

Copy

Expand all Collapse all

`{  *   "name": "John",      *   "teams": [          *   "X9vJ6R2qFzL8sK1mVxZcPwNtY3gT5yD"                   ],      *   "roles": [          *   "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH"                   ]       }`

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "unitId": "kD8tPcZ3fYxSjV9qWvL5X2TmQbN1nR6",              *   "name": "John",              *   "email": "john@aitable.ai",              *   "avatar": "[https://s1.aitable.ai/public/2023/05/16/00a91wbb47fd0594fbc975d2d764a45q](https://s1.aitable.ai/public/2023/05/16/00a91wbb47fd0594fbc975d2d764a45q)",              *   "mobile": {                  *   "number": "13000111000",                      *   "areaCode": "+86"                               },              *   "status": 1,              *   "type": "PrimaryAdmin",              *   "teams": [                  *   {                          *   "unitId": "X9vJ6R2qFzL8sK1mVxZcPwNtY3gT5yD",                              *   "name": "Team A",                              *   "sequence": 1,                              *   "parentUnitId": "bD3fT4cL9wZ5mN8xSsK7qVvRjXhGpY",                              *   "roles": [                                  *   {                                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                                              *   "name": "Finance",                                              *   "sequence": 2001                                                                   }                                                       ]                                           }                               ],              *   "roles": [                  *   {                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                              *   "name": "Finance",                              *   "sequence": 2001                                           }                               ]                   }       }`

## [](#tag/Member/operation/delete-a-member)Delete a member

This interface is used to delete a member.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/members/{unitId}](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/members/%7BunitId%7D)
*   Request method: `DELETE`
*   Request header must contain:
    *   `Authorization: Bearer {Your API Token}`

Example requests for cURL is in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [Delete a member](/api/delete-a-member).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

unitId

required

string

Example: kD8tPcZ3fYxSjV9qWvL5X2TmQbN1nR6

The unitId of the member to be deleted.

### Responses

**200**

Successfully

delete/fusion/v1/spaces/{spaceId}/members/{unitId}

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/members/{unitId}

### Request samples

*   cURL

Copy

curl \-X DELETE \\
'https://aitable.ai/fusion/v1/spaces/{spaceId}/members/{unitId}' \\
\-H 'Authorization: Bearer {Your API Token}'

### Response samples

*   200

Content type

application/json

Copy

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS"       }`

# [](#tag/Team)Team

The data structure of the Team is as follows.

Properties

Type

Description

Example Value

unitId

string

The unique ID of the team.

"C7dVpM3tBxL4jT6hRyK5WwQsZgX8fNv"

name

string

Team's name

"Team A"

sequence

integer

The sorting order of the team at the current hierarchy level. In the Contacts, teams are sorted in ascending order based on this sequence number. If there are duplicate sequence numbers within the same hierarchy level, the teams will be sorted in ascending order based on their creation time.

1

parentUnitId

string

The unitId of the parent team to which the team belongs.

"nL2vU7tZwKfR4aGxQyJjXq6YbP5mS9c"

roles

array of object

Roles associated with the team.

`[{"unitId": "M3sJ6mL4fY9xN1yZpRtG7wKvX2TcVq","name": "role A","sequence": 1},..}]`

## [](#tag/Team/operation/list-the-team-members)List the team members

This interface is used to get the list of members under the specified team.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/teams/{unitId}/members](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/teams/%7BunitId%7D/members)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {Your API Token}`

Example requests for cURL is in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [List the team members](/api/list-the-team-members).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

unitId

required

string

Example: X9vJ6R2qFzL8sK1mVxZcPwNtY3gT5yD

Team's unitId

##### query Parameters

pageSize

number

Example: pageSize=100

The number of members to return per page. The default is to return 100 members per page. The valid range for this parameter is an integer from 1 to 1000.

pageNum

number

Example: pageNum=1

The page number for pagination, used in conjunction with the pageSize parameter. For example, pageSize=1000&pageNum=2 will return records from 1001 to 2000.

sensitiveData

string

Example: sensitiveData=true

Fill in "true" to get sensitive member data such as phone number and email address.

### Responses

**200**

Successfully

get/fusion/v1/spaces/{spaceId}/teams/{unitId}/members

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/teams/{unitId}/members

### Request samples

*   cURL

Copy

curl \-X GET \\
"https://aitable.ai/fusion/v1/spaces/{spaceId}/teams/{unitId}/members?sensitiveData=true" \\
\-H "Authorization: Bearer {Your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "pageNum": 1,              *   "pageSize": 100,              *   "total": 500,              *   "members": [                  *   {                          *   "unitId": "kD8tPcZ3fYxSjV9qWvL5X2TmQbN1nR6",                              *   "name": "John",                              *   "email": "john@aitable.ai",                              *   "avatar": "[https://s1.aitable.ai/public/2023/05/16/00a91wbb47fd0594fbc975d2d764a45q](https://s1.aitable.ai/public/2023/05/16/00a91wbb47fd0594fbc975d2d764a45q)",                              *   "mobile": {                                  *   "number": "13000111000",                                      *   "areaCode": "+86"                                                       },                              *   "status": 1,                              *   "type": "PrimaryAdmin",                              *   "teams": [                                  *   {                                          *   "unitId": "X9vJ6R2qFzL8sK1mVxZcPwNtY3gT5yD",                                              *   "name": "Team A",                                              *   "sequence": 1,                                              *   "parentUnitId": "bD3fT4cL9wZ5mN8xSsK7qVvRjXhGpY",                                              *   "roles": [                                                  *   {                                                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                                                              *   "name": "Finance",                                                              *   "sequence": 2001                                                                                           }                                                                               ]                                                                   }                                                       ],                              *   "roles": [                                  *   {                                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                                              *   "name": "Finance",                                              *   "sequence": 2001                                                                   }                                                       ]                                           }                               ]                   }       }`

## [](#tag/Team/operation/list-teams)List sub teams

This interface is used to get the list of teams under the specified team.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/teams/{unitId}/children](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/teams/%7BunitId%7D/children)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {Your API Token}`

Example requests for cURL is in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [List teams](/api/list-teams).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

unitId

required

string

Example: X9vJ6R2qFzL8sK1mVxZcPwNtY3gT5yD

Team's unitId

##### query Parameters

pageSize

number

Example: pageSize=100

The number of teams to return per page. The default is to return 100 teams per page. The valid range for this parameter is an integer from 1 to 1000.

pageNum

number

Example: pageNum=1

The page number for pagination, used in conjunction with the pageSize parameter. For example, pageSize=1000&pageNum=2 will return records from 1001 to 2000.

### Responses

**200**

Successfully

get/fusion/v1/spaces/{spaceId}/teams/{unitId}/children

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/teams/{unitId}/children

### Request samples

*   cURL

Copy

curl \-X GET \\
"https://aitable.ai/fusion/v1/spaces/{spaceId}/teams/{unitId}/children" \\
\-H "Authorization: Bearer {Your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "pageNum": 1,              *   "pageSize": 100,              *   "total": 500,              *   "teams": [                  *   {                          *   "unitId": "X9vJ6R2qFzL8sK1mVxZcPwNtY3gT5yD",                              *   "name": "Team A",                              *   "sequence": 1,                              *   "parentUnitId": "bD3fT4cL9wZ5mN8xSsK7qVvRjXhGpY",                              *   "roles": [                                  *   {                                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                                              *   "name": "Finance",                                              *   "sequence": 2001                                                                   }                                                       ]                                           }                               ]                   }       }`

## [](#tag/Team/operation/create-a-team)Create a team

This interface is used to create a team.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/teams](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/teams)
*   Request method: `POST`
*   Request header must contain:
    *   `Authorization: Bearer {Your API Token}`
    *   `Content-Type：application/json`

Example requests for cURL is in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [Create a team](/api/create-a-team).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

##### Request Body schema: application/json

Request body structure

name

required

string

Team's name

sequence

number

The sorting order of the team at the current hierarchy level. In the Contacts, teams are sorted in ascending order based on this sequence number. If there are duplicate sequence numbers within the same hierarchy level, the teams will be sorted in ascending order based on their creation time.

parentUnitId

string

The unitId of the parent team to which the team belongs.

roles

Array of strings

Roles associated with the member.

### Responses

**201**

Successfully created a team.

post/fusion/v1/spaces/{spaceId}/teams

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/teams

### Request samples

*   Payload
*   cURL

Content type

application/json

Copy

Expand all Collapse all

`{  *   "name": "Team A",      *   "sequence": 1,      *   "parentUnitId": "bD3fT4cL9wZ5mN8xSsK7qVvRjXhGpY",      *   "roles": [          *   "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH"                   ]       }`

### Response samples

*   201

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "unitId": "X9vJ6R2qFzL8sK1mVxZcPwNtY3gT5yD",              *   "name": "Team A",              *   "sequence": 1,              *   "parentUnitId": "bD3fT4cL9wZ5mN8xSsK7qVvRjXhGpY",              *   "roles": [                  *   {                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                              *   "name": "Finance",                              *   "sequence": 2001                                           }                               ]                   }       }`

## [](#tag/Team/operation/update-a-team)Update a team

This interface is used to update a team.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/teams/{unitId}](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/teams/%7BunitId%7D)
*   Request method: `PUT`
*   Request header must contain:
    *   `Authorization: Bearer {Your API Token}`
    *   `Content-Type：application/json`

Example requests for cURL is in the area on the right for your reference.

The request body includes the properties and corresponding values to be updated in the team. Only the explicitly specified properties will be updated, while the properties that are not specified will retain their old values.

> If you need more detailed operation guidance, you can read the [Update a team](/api/update-a-team).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

unitId

required

string

Example: zJ6TuQvH2RtNfSx9eY7XKgD1oWcE5pV

The unitId of the team to be updated.

##### Request Body schema: application/json

Request body structure

name

string

Team's name

sequence

number

The sorting order of the team at the current hierarchy level. In the Contacts, teams are sorted in ascending order based on this sequence number. If there are duplicate sequence numbers within the same hierarchy level, the teams will be sorted in ascending order based on their creation time.

parentUnitId

string

The unitId of the parent team to which the team belongs.

roles

Array of strings

Roles associated with the member.

### Responses

**200**

Successfully

put/fusion/v1/spaces/{spaceId}/teams/{unitId}

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/teams/{unitId}

### Request samples

*   Payload
*   cURL

Content type

application/json

Copy

Expand all Collapse all

`{  *   "name": "Team A",      *   "sequence": 1,      *   "parentUnitId": "bD3fT4cL9wZ5mN8xSsK7qVvRjXhGpY",      *   "roles": [          *   "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH"                   ]       }`

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "unitId": "X9vJ6R2qFzL8sK1mVxZcPwNtY3gT5yD",              *   "name": "Team A",              *   "sequence": 1,              *   "parentUnitId": "bD3fT4cL9wZ5mN8xSsK7qVvRjXhGpY",              *   "roles": [                  *   {                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                              *   "name": "Finance",                              *   "sequence": 2001                                           }                               ]                   }       }`

## [](#tag/Team/operation/delete-a-team)Delete a team

This interface is used to delete a team.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/teams/{unitId}](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/teams/%7BunitId%7D)
*   Request method: `DELETE`
*   Request header must contain:
    *   `Authorization: Bearer {Your API Token}`

> If you need more detailed operation guidance, you can read the [Delete a team](/api/delete-a-team).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

##### query Parameters

unitId

required

string

Example: unitId=zJ6TuQvH2RtNfSx9eY7XKgD1oWcE5pV

The unitId of the team to be deleted.

### Responses

**200**

Successfully

delete/fusion/v1/spaces/{spaceId}/teams/{unitId}

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/teams/{unitId}

### Request samples

*   cURL

Copy

curl \-X DELETE \\
'https://aitable.ai/fusion/v1/spaces/{spaceId}/teams/{unitId}' \\
\-H 'Authorization: Bearer {Your API Token}'

### Response samples

*   200

Content type

application/json

Copy

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS"       }`

# [](#tag/Role)Role

The data structure of the Role is as follows.

Properties

Type

Description

Example Value

unitId

string

Role's unitId

"sZ6gJ9L2HxP5XW1fRtNwE4zKqVcY7yM"

name

string

Role's name

"Finance"

sequence

integer

The sorting order of roles starts from 2000 and increases incrementally, such as "2001, 2002, 2003". The sorting sequence of roles can have duplicates, and if there are duplicates, the roles are further sorted in ascending order based on their creation time.

2001

## [](#tag/Role/operation/list-units-under-the-role)List units under the role

This interface is used to get the members and teams associated with the role.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/roles/{unitId}/units](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/roles/%7BunitId%7D/units)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {Your API Token}`

Example requests for cURL is in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [List units under the role](/api/list-units-under-the-role).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

unitId

required

string

Example: gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH

Role's unitId

##### query Parameters

sensitiveData

string

Example: sensitiveData=true

Fill in "true" to get sensitive member data such as phone number and email address.

### Responses

**200**

Successfully

get/fusion/v1/spaces/{spaceId}/roles/{unitId}/units

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/roles/{unitId}/units

### Request samples

*   cURL

Copy

curl \-X GET \\
"https://aitable.ai/fusion/v1/spaces/{spaceId}/roles/{unitId}/units?sensitiveData=true" \\
\-H "Authorization: Bearer {Your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "members": [                  *   {                          *   "unitId": "kD8tPcZ3fYxSjV9qWvL5X2TmQbN1nR6",                              *   "name": "John",                              *   "email": "john@aitable.ai",                              *   "avatar": "[https://s1.aitable.ai/public/2023/05/16/00a91wbb47fd0594fbc975d2d764a45q](https://s1.aitable.ai/public/2023/05/16/00a91wbb47fd0594fbc975d2d764a45q)",                              *   "mobile": {                                  *   "number": "13000111000",                                      *   "areaCode": "+86"                                                       },                              *   "status": 1,                              *   "type": "PrimaryAdmin",                              *   "teams": [                                  *   {                                          *   "unitId": "X9vJ6R2qFzL8sK1mVxZcPwNtY3gT5yD",                                              *   "name": "Team A",                                              *   "sequence": 1,                                              *   "parentUnitId": "bD3fT4cL9wZ5mN8xSsK7qVvRjXhGpY",                                              *   "roles": [                                                  *   {                                                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                                                              *   "name": "Finance",                                                              *   "sequence": 2001                                                                                           }                                                                               ]                                                                   }                                                       ],                              *   "roles": [                                  *   {                                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                                              *   "name": "Finance",                                              *   "sequence": 2001                                                                   }                                                       ]                                           }                               ],              *   "teams": [                  *   {                          *   "unitId": "X9vJ6R2qFzL8sK1mVxZcPwNtY3gT5yD",                              *   "name": "Team A",                              *   "sequence": 1,                              *   "parentUnitId": "bD3fT4cL9wZ5mN8xSsK7qVvRjXhGpY",                              *   "roles": [                                  *   {                                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                                              *   "name": "Finance",                                              *   "sequence": 2001                                                                   }                                                       ]                                           }                               ]                   }       }`

## [](#tag/Role/operation/list-roles)List roles

This interface is used to get the list of roles in the space.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/roles](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/roles)
*   Request method: `GET`
*   Request header must contain: `Authorization: Bearer {Your API Token}`

Example requests for cURL is in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [List roles](/api/list-roles).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

##### query Parameters

pageSize

number

Example: pageSize=100

The number of roles to return per page. The default is to return 100 roles per page. The valid range for this parameter is an integer from 1 to 1000.

pageNum

number

Example: pageNum=1

The page number for pagination, used in conjunction with the pageSize parameter. For example, pageSize=1000&pageNum=2 will return records from 1001 to 2000.

### Responses

**200**

Successfully

get/fusion/v1/spaces/{spaceId}/roles

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/roles

### Request samples

*   cURL

Copy

curl \-X GET \\
"https://aitable.ai/fusion/v1/spaces/{spaceId}/roles" \\
\-H "Authorization: Bearer {Your API Token}"

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "pageNum": 1,              *   "pageSize": 100,              *   "total": 500,              *   "roles": [                  *   {                          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",                              *   "name": "Finance",                              *   "sequence": 2001                                           }                               ]                   }       }`

## [](#tag/Role/operation/create-a-role)Create a role

This interface is used to create a role.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/roles](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/roles)
*   Request method: `POST`
*   Request header must contain:
    *   `Authorization: Bearer {Your API Token}`
    *   `Content-Type：application/json`

Example requests for cURL is in the area on the right for your reference.

> If you need more detailed operation guidance, you can read the [Create a role](/api/create-a-role).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

##### Request Body schema: application/json

Request body structure

name

required

string

Role's name

sequence

number

The sorting order of roles starts from 2000 and increases incrementally, such as "2001, 2002, 2003". The sorting sequence of roles can have duplicates, and if there are duplicates, the roles are further sorted in ascending order based on their creation time.

### Responses

**201**

Successfully created a role.

post/fusion/v1/spaces/{spaceId}/roles

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/roles

### Request samples

*   Payload
*   cURL

Content type

application/json

Copy

`{  *   "name": "Finance",      *   "sequence": 2001       }`

### Response samples

*   201

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",              *   "name": "Finance",              *   "sequence": 2001                   }       }`

## [](#tag/Role/operation/update-a-role)Update a role

This interface is used to update a role.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/roles/{unitId}](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/roles/%7BunitId%7D)
*   Request method: `PUT`
*   Request header must contain:
    *   `Authorization: Bearer {Your API Token}`
    *   `Content-Type：application/json`

Example requests for cURL is in the area on the right for your reference.

The request body includes the properties and corresponding values to be updated in the role. Only the explicitly specified properties will be updated, while the properties that are not specified will retain their old values.

> If you need more detailed operation guidance, you can read the [Update a role](/api/update-a-role).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

unitId

required

string

Example: kD8tPcZ3fYxSjV9qWvL5X2TmQbN1nR6

The unitId of the role to be updated.

##### Request Body schema: application/json

Request body structure

name

string

Role's name

sequence

number

The sorting order of roles starts from 2000 and increases incrementally, such as "2001, 2002, 2003". The sorting sequence of roles can have duplicates, and if there are duplicates, the roles are further sorted in ascending order based on their creation time.

### Responses

**200**

Successfully

put/fusion/v1/spaces/{spaceId}/roles/{unitId}

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/roles/{unitId}

### Request samples

*   Payload
*   cURL

Content type

application/json

Copy

`{  *   "name": "Finance",      *   "sequence": 2001       }`

### Response samples

*   200

Content type

application/json

Copy

Expand all Collapse all

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS",      *   "data": {          *   "unitId": "gP5zF7xW1mC2nQ4sXrKjV8bT6tL9yH",              *   "name": "Finance",              *   "sequence": 2001                   }       }`

## [](#tag/Role/operation/delete-a-role)Delete a role

This interface is used to delete a role.

*   Request address: [https://aitable.ai/fusion/v1/spaces/{spaceId}/roles/{unitId}](https://aitable.ai/fusion/v1/spaces/%7BspaceId%7D/roles/%7BunitId%7D)
*   Request method: `DELETE`
*   Request header must contain:
    *   `Authorization: Bearer {Your API Token}`

> If you need more detailed operation guidance, you can read the [Delete a role](/api/delete-a-role).

If you have more complex interface requests, you can refer to the following parameters and combine them by yourself.

##### path Parameters

spaceId

required

string

Example: spcjXzqVrjaP3

Space ID

unitId

required

string

Example: kD8tPcZ3fYxSjV9qWvL5X2TmQbN1nR6

The unitId of the role to be deleted.

### Responses

**200**

Successfully

delete/fusion/v1/spaces/{spaceId}/roles/{unitId}

AITable API server address

https://aitable.ai/fusion/v1/spaces/{spaceId}/roles/{unitId}

### Request samples

*   cURL

Copy

curl \-X DELETE \\
'https://aitable.ai/fusion/v1/spaces/{spaceId}/roles/{unitId}' \\
\-H 'Authorization: Bearer {Your API Token}'

### Response samples

*   200

Content type

application/json

Copy

`{  *   "success": true,      *   "code": 200,      *   "message": "SUCCESS"       }`

Developer Center

*   [Development guide](/api/introduction)
*   [API Reference](/api/reference)

Social

*   [Twitter](https://twitter.com/aitable_ai)

More

*   [Homepage](https://aitable.ai?home=1)
*   [Help Center](https://help.aitable.ai)
*   [GitHub](https://github.com/apitable/apitable)

© 2023 [AITable Ltd.](https://aitable.ai) All rights reserved.