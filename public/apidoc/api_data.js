define({ "api": [
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "delete",
    "url": "/api/v1/issues/watch/",
    "title": "to delete watcher of issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issueId of issue. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Notifications OFF related to issue\",\n    \"status\": 200,\n    \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "DeleteApiV1IssuesWatch"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/issues/",
    "title": "to fetch an issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>of issue. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Issue fetched\",\n    \"status\": 200,\n    \"data\": {\n        \"status\": \"In-Progress\",\n        \"attachments\": [],\n        \"issueId\": \"tVQzI9_sj\",\n        \"title\": \"Abc\",\n        \"reporter\": {\n        \"firstName\": \"Xyz\",\n        \"lastName\": \"mno\",\n        \"email\": \"xyzmno@gmail.com\"\n        },\n        \"description\": \"<p>abc def</p>\",\n        \"assignees\": [\n        {\n            \"assignedOn\": \"2020-08-01T11:51:04.490Z\",\n            \"to\": {\n            \"firstName\": \"abc\",\n            \"lastName\": \"def\",\n            \"email\": \"abcdef@gmail.com\"\n            },\n            ...........\n        }\n        ],\n        \"createdOn\": \"2020-08-01T11:51:04.491Z\",\n        \"modifiedOn\": \"2020-08-01T11:51:04.492Z\"\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "GetApiV1Issues"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/issues/all",
    "title": "to fetch all issues.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "limit",
            "description": "<p>maximum number of issues fetched. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sort",
            "description": "<p>field according to which issues which be sorted. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "skip",
            "description": "<p>number of issues to skip. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "searchType",
            "description": "<p>field according to which the issues will filtered upon search. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "search",
            "description": "<p>the string according to which issues are filtered. (query params) (optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Issues fetched\",\n    \"status\": 200,\n    \"data\": [\n        {\n        \"status\": \"Done\",\n        \"issueId\": \"qOJMB0PxA\",\n        \"title\": \"Test\",\n        \"reporter\": {\n            \"firstName\": \"Abc\",\n            \"lastName\": \"Def\",\n            \"email\": \"abcdef@gmail.com\"\n        },\n        \"description\": \"Test 123\",\n        \"createdOn\": \"2020-07-29T19:26:12.150Z\",\n        \"modifiedOn\": \"2020-07-31T19:12:14.000Z\"\n        },\n        .....\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "GetApiV1IssuesAll"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/issues/all/assigned",
    "title": "to fetch all assigned issues to user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "limit",
            "description": "<p>maximum number of issues fetched. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sort",
            "description": "<p>field according to which issues which be sorted. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "skip",
            "description": "<p>number of issues to skip. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "searchType",
            "description": "<p>field according to which the issues will filtered upon search. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "search",
            "description": "<p>the string according to which issues are filtered. (query params) (optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Issues fetched\",\n    \"status\": 200,\n    \"data\": [\n        {\n        \"status\": \"Done\",\n        \"issueId\": \"qOJMB0PxA\",\n        \"title\": \"Test\",\n        \"reporter\": {\n            \"firstName\": \"Abc\",\n            \"lastName\": \"Def\",\n            \"email\": \"abcdef@gmail.com\"\n        },\n        \"description\": \"Test 123\",\n        \"createdOn\": \"2020-07-29T19:26:12.150Z\",\n        \"modifiedOn\": \"2020-07-31T19:12:14.000Z\"\n        },\n        .....\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "GetApiV1IssuesAllAssigned"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/issues/all/assigned/count",
    "title": "to fetch number of issues assigned to user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "searchType",
            "description": "<p>field according to which the issues will filtered upon search. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "search",
            "description": "<p>the string according to which issues are filtered. (query params) (optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Issues count fetched\",\n    \"status\": 200,\n    \"data\": 15\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "GetApiV1IssuesAllAssignedCount"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/issues/all/count",
    "title": "to fetch number of issues.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "searchType",
            "description": "<p>field according to which the issues will filtered upon search. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "search",
            "description": "<p>the string according to which issues are filtered. (query params) (optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Issues count fetched\",\n    \"status\": 200,\n    \"data\": 15\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "GetApiV1IssuesAllCount"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/issues/all/reported",
    "title": "to fetch all reported issues by user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "limit",
            "description": "<p>maximum number of issues fetched. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sort",
            "description": "<p>field according to which issues which be sorted. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "skip",
            "description": "<p>number of issues to skip. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "searchType",
            "description": "<p>field according to which the issues will filtered upon search. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "search",
            "description": "<p>the string according to which issues are filtered. (query params) (optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "      {\n\"error\": false,\n\"message\": \"Issues fetched\",\n\"status\": 200,\n\"data\": [\n      {\n          \"status\": \"In-Progress\",\n          \"issueId\": \"KzbTYsqH2\",\n          \"title\": \"Test 3\",\n          \"description\": \"Test 3\",\n          \"assignees\": [\n              {\n              \"assignedOn\": \"2020-07-29T19:02:03.695Z\",\n              \"to\": {\n                  \"firstName\": \"xyz\",\n                  \"lastName\": \"mno\",\n                  \"email\": \"xyzmno@gmail.com\"\n              }\n              },\n              {\n              \"assignedOn\": \"2020-07-29T19:02:03.695Z\",\n              \"to\": {\n                  \"firstName\": \"abc\",\n                  \"lastName\": \"def\",\n                  \"email\": \"abcdef@gmail.com\"\n              }\n              }\n          ],\n          \"createdOn\": \"2020-07-29T19:02:03.696Z\",\n          \"modifiedOn\": \"2020-07-29T19:02:03.696Z\"\n      },\n      ..............\n  ]",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "GetApiV1IssuesAllReported"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/issues/all/reported/count",
    "title": "to fetch number of issues reported by user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "searchType",
            "description": "<p>field according to which the issues will filtered upon search. (query params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "search",
            "description": "<p>the string according to which issues are filtered. (query params) (optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Issues count fetched\",\n    \"status\": 200,\n    \"data\": 15\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "GetApiV1IssuesAllReportedCount"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/issues/comment/all",
    "title": "to fetch all comments on issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issueId of issue. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Comments fetched\",\n    \"status\": 200,\n    \"data\": [\n        {\n        \"createdOn\": \"2020-08-01T15:48:25.614Z\",\n        \"modifiedOn\": \"2020-08-01T15:48:25.614Z\",\n        \"by\": {\n            \"firstName\": \"abc\",\n            \"lastName\": \"def\",\n            \"email\": \"abcdef@gmail.com\"\n        },\n        \"text\": \"<p>test comment 1</p>\"\n        },\n        .....\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "GetApiV1IssuesCommentAll"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/issues/watch/all",
    "title": "to fetch all watchcers of issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issueId of issue. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Watchers fetched\",\n    \"status\": 200,\n    \"data\": [\n        {\n        \"watchedOn\": \"2020-08-01T15:41:20.802Z\",\n            \"by\": {\n                \"firstName\": \"abc\",\n                \"lastName\": \"def\",\n                \"email\": \"abcdef@gmail.com\"\n            },\n            ......\n        }\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "GetApiV1IssuesWatchAll"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/issues/watch/all/count",
    "title": "to fetch number of watchcers of issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issueId of issue. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Watchers count fetched\",\n    \"status\": 200,\n    \"data\": {\n        \"count\": 1\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "GetApiV1IssuesWatchAllCount"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/issues/",
    "title": "to create a new issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>title of issue. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>description of issue. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "assignees",
            "description": "<p>users to whom the issue has been assigned. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n  \"error\": false,\n  \"message\": \"Issue created\",\n  \"status\": 200,\n  \"data\": {\n      issueId:'tVQzI9_sj'\n  }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "PostApiV1Issues"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/issues/attachments",
    "title": "to add attachments to issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body formdata params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issueId of issue. (body formdata params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "attachments",
            "description": "<p>attachments of issue. (body formdata params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Files uploaded successfully\",\n    \"status\": 200,\n    \"data\": [\n        \"http://localhost:3000/uploads/GnDkjjHLY__1596297923059__121453.jpg\",\n        \"http://localhost:3000/uploads/c2oinE3oK__1596297923064__182677.jpg\"\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "PostApiV1IssuesAttachments"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/issues/comment/",
    "title": "to add new comment to issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issueId of issue. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "comment",
            "description": "<p>comment to issue. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Comment saved\",\n    \"status\": 200,\n    \"data\": [\n        {\n        \"createdOn\": \"2020-08-01T15:48:25.614Z\",\n        \"modifiedOn\": \"2020-08-01T15:48:25.614Z\",\n        \"by\": {\n            \"firstName\": \"abc\",\n            \"lastName\": \"def\",\n            \"email\": \"abcdef@gmail.com\"\n        },\n        \"text\": \"<p>test comment 1</p>\"\n        },\n        ......\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "PostApiV1IssuesComment"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/issues/watch/",
    "title": "to add new watcher to issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issueId of issue. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Notifications ON related to issue\",\n    \"status\": 200,\n    \"data\": [\n        {\n            \"watchedOn\": \"2020-08-01T15:41:20.802Z\",\n            \"by\": {\n                \"firstName\": \"abc\",\n                \"lastName\": \"def\",\n                \"email\": \"abcdef@gmail.com\"\n            }\n        },\n        ......\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "PostApiV1IssuesWatch"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/issues/",
    "title": "to update an issue.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issueId of issue. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>status of issue. (body params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>title of issue. (body params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>description of issue. (body params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "assignees",
            "description": "<p>users to whom the issue has been assigned. (body params) (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "attachments",
            "description": "<p>attachments of issue. (body params) (optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Issue updated\",\n    \"status\": 200,\n    \"data\": {\n        \"status\": \"In-Progress\",\n        \"attachments\": [],\n        \"issueId\": \"tVQzI9_sj\",\n        \"title\": \"Abc2\",\n        \"reporter\": {\n        \"firstName\": \"Abc\",\n        \"lastName\": \"def\",\n        \"email\": \"abcdef@gmail.com\"\n        },\n        \"description\": \"<p>abc def</p>\",\n        \"assignees\": [\n        {\n            \"assignedOn\": \"2020-08-01T11:51:04.490Z\",\n            \"to\": {\n            \"firstName\": \"xyz\",\n            \"lastName\": \"mno\",\n            \"email\": \"xyzmno@gmail.com\"\n            }\n        },\n        ...........\n        ],\n        \"createdOn\": \"2020-08-01T11:51:04.491Z\",\n        \"modifiedOn\": \"2020-08-01T12:00:52.000Z\"\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "PutApiV1Issues"
  },
  {
    "group": "issues",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/issues/notifications/mark",
    "title": "to mark notifications related to issue as read.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "issueId",
            "description": "<p>issueId of issue. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n\"error\": false,\n\"message\": \"All notifications marked as read\",\n\"status\": 200,\n\"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/issue.js",
    "groupTitle": "issues",
    "name": "PutApiV1IssuesNotificationsMark"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/users/",
    "title": "to get details of user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"User Details Found\",\n  \"status\": 200,\n  \"data\": {\n     email: \"abc@gmail.com\"\n     firstName: \"ABC\"\n     lastName: \"978\"\n     mobileNumber: 9876543210,\n     countryCode: '91'\n }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "GetApiV1Users"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/users/all",
    "title": "to get details of all users.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"All User Details Found\",\n  \"status\": 200,\n  \"data\": [\n     {\n         email: \"abc@gmail.com\"\n         firstName: \"ABC\"\n         lastName: \"DEF\"\n     },\n     {\n         email: \"xyz@gmail.com\"\n         firstName: \"XYZ\"\n         lastName: \"123\"\n     },\n     .........................\n  ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "GetApiV1UsersAll"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/users/notifications/all",
    "title": "to fetch all notification of user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sort",
            "description": "<p>to sort by specific field. (body params) (optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n   data: [{ \n     by:  { \n       email: \"abcxyz@gmail.com\", \n       firstName: \"Abc\", \n       lastName: \"Xyz\" \n     }\n     createdOn: \"2020-07-30T07:11:22.004Z\",\n     issueId: \"b0CVMUeKV\",\n     message: \"abc xyz\",\n     read: false\n   },\n   .....\n   ​​],\n   error: false,\n   message: \"Notifications fetched\",\n   status: 200\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "GetApiV1UsersNotificationsAll"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/users/notifications/all/unread",
    "title": "to fetch all unread notification of user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n   data: [{ \n     by:  { \n       email: \"abcxyz@gmail.com\", \n       firstName: \"Abc\", \n       lastName: \"Xyz\" \n     }\n     createdOn: \"2020-07-30T07:11:22.004Z\",\n     issueId: \"b0CVMUeKV\",\n     message: \"abc xyz\",\n     read: false\n   },\n   .....\n   ​​],\n   error: false,\n   message: \"Notifications fetched\",\n   status: 200\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "GetApiV1UsersNotificationsAllUnread"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/forgot/password",
    "title": "to send OTP to user's registered email address.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"OTP send to registered email\",\n  \"status\": 200,\n  \"data\":null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersForgotPassword"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/forgot/password",
    "title": "to send OTP to user's registered email address.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "OTP",
            "description": "<p>OTP of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "newPassword",
            "description": "<p>new password of user account. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Password changed\",\n  \"status\": 200,\n  \"data\":null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersForgotPassword"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/login",
    "title": "to login into user's account.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>password of user's account. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Login Successful\",\n  \"status\": 200,\n  \"data\": {\n         \"userId\": \"xxTb61m4F\",\n         \"authToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Im8zMlh5cVpjcSIsImlhdCI6MTU5NTQ4MzU0Mzk1MCwiZXhwIjoxNTk1NTY5OTQzLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJpbmN1YkNoYXQiLCJkYXRhIjp7InVzZXJJZCI6Ik1iY3pENW9DZyIsImZpcnN0TmFtZSI6IlNhdXJhdiIsImxhc3ROYW1lIjoiR2FyZyIsImVtYWlsIjoic2F1cmF2Z2FyZzAwMUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjc2OTYyNTY0MDAsImNvdW50cnlDb2RlIjoiOTEifX0.K_gZEgEUvBPOUSRvN_e6tPVf-UKuvzPL387hlKvE_ig\"\n  }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersLogin"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/logout",
    "title": "to log out from user's account.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Logged Out Successfully\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersLogout"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/signup",
    "title": "to create a new user account.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstName",
            "description": "<p>first name of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastName",
            "description": "<p>last name of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "mobileNumber",
            "description": "<p>mobile number of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>password of user's account. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "countryCode",
            "description": "<p>country code of user's mobile number. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"User created\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersSignup"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/users/notifications/all/unread/mark",
    "title": "to mark all unread notification of user as read.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n  \"error\": false,\n  \"message\": \"All notifications marked as read\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PutApiV1UsersNotificationsAllUnreadMark"
  }
] });
