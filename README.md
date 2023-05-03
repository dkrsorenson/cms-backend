# Rajant CMS Backend - Technical Assessment

## Setup and Testing


## API Documentation

Base URL: http://localhost:3001/api/v1/

------------------------------------------------------------------------------------------

#### Authorization Endpoints

<details>
 <summary><code>POST</code> <code><b>/auth/signup</b></code> <code>(registers a new user in the system)</code></summary>

##### Body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | username  |  required | string   | The username will be used to login to the user's account. |
> | pin  |  required | string   | The pin is a string containing only numbers between 4 and 6 characters. It will be used to sign in to the user's account. |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `application/json`                | <pre>{<br>  "message": "Successfully registered user.",<br>}</pre> |
> | `400`         | `application/json`                | <pre>{<br>  "message": "Username must be unique, please try a different username."<br>}</pre> |
> | `400`         | `application/json`                | <pre>{<br>  "message": "Invalid request, see errors.",<br>  "errors": []<br>}</pre> |

</details>

<details>
 <summary><code>POST</code> <code><b>/auth/login</b></code> <code>(logins existing user and returns auth token)</code></summary>

##### Body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | username  |  required | string   | The username will be used to login to the user's account. |
> | pin  |  required | string   | The pin is a string containing only numbers between 4 and 6 characters. It will be used to sign in to the user's account. |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | <pre>{<br>  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVWlkIjoiOTNiMmE5Y2QtZGVlNC00MmVmLTg2OTItNWQ2NjY0MThlNTUwIiwiY3JlYXRlZEF0IjoiMjAyMy0wNS0wM1QwMToxNDoxMC42MjdaIiwiaWF0IjoxNjgzMDc2NDUwLCJleHAiOjE2ODMwNzgyNTB9.6cNbN-MaN0U2ousZtRk-iN0lk_EmMbs-e6Mz9S2OZ-Y"<br>}</pre> |
> | `400`         | `application/json`                | <pre>{<br>  "message": "Invalid request, see errors.",<br>  "errors": []<br>}</pre> |
> | `400`         | `application/json`                | <pre>{<br>  "message": "Invalid username or pin."<br>}</pre> |
> | `400`         | `application/json`                | <pre>{<br>  "message": "User account is not active."<br>}</pre> |

</details>

------------------------------------------------------------------------------------------

#### User Endpoints

<details>
 <summary><code>GET</code> <code><b>/user/me</b></code> <code>(gets the user's information)</code></summary>

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | <pre>{<br>  "uid": "93b2a9cd-dee4-42ef-8692-5d666418e550",<br>  "username": "dkrs",<br>  "status": "active"<br>}</pre> |

</details>

------------------------------------------------------------------------------------------

#### Item Endpoints

<details>
 <summary><code>GET</code> <code><b>/items</b></code> <code>(gets a paginated list of filtered and/or sorted items belonging to the logged-in user)</code></summary>

##### Query Params

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | page  |  optional | number   | The page number for paginating the data. Default page: 1. |
> | limit  |  optional | number   | The number of items desired per page. Default limit: 25. |
> | status  |  optional | string   | Filters by the status. Valid values are 'active', 'draft', 'inactive', and 'archived'. |
> | visibility  |  optional | string   | Filters by the visibility. Valid values are 'public' and 'private'. |
> | title | optional | string   | Filters by the title. For now the title must be an exact match. |
> | sort  |  optional | string   | Sorts by the specified fields. Example format: "createdAt:desc,title:asc". |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | <pre>{<br>  "count": 0,<br>  "totalCount": 0,<br>  "page": 1,<br>  "perPageCount": 25,<br>  "items": []<br>}</pre> |
> | `400`         | `application/json`                | <pre>{<br>  "message": "Invalid request, see errors.",<br>  "errors": []<br>}</pre> |

</details>

<details>
 <summary><code>GET</code> <code><b>/item/:id</b></code> <code>(gets an item by ID (for the logged-in user))</code></summary>

##### Path Params

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id  |  required | number   | The ID number of the item. |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | <pre>{<br>  "id": 1,<br>  "title": "Sample Title",<br>  "content": "Sample content goes here",<br>  "status": "active",<br>  "visibility": "private",<br>  "createdAt": "2023-05-01T16:31:29.981Z",<br>  "updatedAt": "2023-05-01T16:31:29.981Z"<br>}</pre> |
> | `404`         | `application/json`                | <pre>{<br>  "message": "Item not found."<br>}</pre> |

</details>

<details>
 <summary><code>POST</code> <code><b>/items</b></code> <code>(create a new item for the logged-in user)</code></summary>

##### Body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | title | required | string   | The title of the item. |
> | content  |  required | text   | The content of the item. Can be left empty but is still required. |
> | status  |  optional | string   | The status of the item. Valid values are 'active', 'draft', 'inactive', and 'archived'. |
> | visibility  |  optional | string   | The visibility of the item. Valid values are 'public' and 'private'. |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `application/json`                | <pre>{<br>  "id": 1<br>}</pre> |
> | `400`         | `application/json`                | <pre>{<br>  "message": "Invalid request, see errors.",<br>  "errors": []<br>}</pre> |

</details>


<details>
 <summary><code>PATCH</code> <code><b>/items</b></code> <code>(updates an existing item for the logged-in user)</code></summary>

##### Body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | title | optional | string   | The updated title of the item. |
> | content  |  optional | text   | The updated content of the item. |
> | status  |  optional | string   | The updated status of the item. Valid values are 'active', 'draft', 'inactive', and 'archived'. |
> | visibility  |  optional | string   | The updated visibility of the item. Valid values are 'public' and 'private'. |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | <pre>{<br>  "message": Successfully updated item."<br>}</pre> |
> | `404`         | `application/json`                | <pre>{<br>  "message": "Item not found."<br>}</pre> |
> | `400`         | `application/json`                | <pre>{<br>  "message": "Invalid request, see errors.",<br>  "errors": []<br>}</pre> |

</details>

<details>
 <summary><code>DELETE</code> <code><b>/item/:id</b></code> <code>(deletes an item by ID (for the logged-in user))</code></summary>

##### Path Params

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id  |  required | number   | The ID number of the item. |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | <pre>{<br>  "message": Successfully delete item."<br>}</pre> |
> | `404`         | `application/json`                | <pre>{<br>  "message": "Item not found."<br>}</pre> |

</details>

------------------------------------------------------------------------------------------

#### Middlewares

Middlewares run with all item and user related requests to authenticate the user. Below is a list of the possible responses related to authorization errors.

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `401`         | `application/json`                | <pre>{<br>  "message": "Unauthorized"<br>}</pre> |
> | `401`         | `application/json`                | <pre>{<br>  "message": "Expired token, unauthorized."<br>}</pre> |
> | `401`         | `application/json`                | <pre>{<br>  "message": "Invalid token, unauthorized."<br>}</pre> |
