export default {
    "data": [{
        "id": 1,
        "user_id": 1,
        "title": "Test Vocabulary",
        "description": "test",
        "content": "{\n    \"$schema\": \"http:\/\/json-schema.org\/draft-07\/schema\",\n    \"$id\": \"http:\/\/example.com\/example.json\",\n    \"type\": \"object\",\n    \"title\": \"The Root Schema\",\n    \"description\": \"The root schema comprises the entire JSON document.\",\n    \"required\": [\n        \"foo\"\n    ],\n    \"properties\": {\n        \"foo\": {\n            \"$id\": \"#\/properties\/foo\",\n            \"type\": \"string\",\n            \"title\": \"The Foo Schema\",\n            \"description\": \"An explanation about the purpose of this instance.\",\n            \"default\": \"\",\n            \"examples\": [\n                \"bar\"\n            ]\n        }\n    }\n}",
        "created_at": "2020-03-26T19:11:02+00:00",
        "updated_at": "2020-03-26T22:48:39+00:00"
    }, {
        "id": 2,
        "user_id": 1,
        "title": "Test Vocabulary 2",
        "description": "test",
        "content": "{\n    \"$schema\": \"http:\/\/json-schema.org\/draft-07\/schema\",\n    \"$id\": \"http:\/\/example.com\/example.json\",\n    \"type\": \"object\",\n    \"title\": \"The Root Schema\",\n    \"description\": \"The root schema comprises the entire JSON document.\",\n    \"required\": [\n        \"fooz\"\n    ],\n    \"properties\": {\n        \"fooz\": {\n            \"$id\": \"#\/properties\/fooz\",\n            \"type\": \"string\",\n            \"title\": \"The FooZ Schema\",\n            \"description\": \"An explanation about the purpose of this instance.\",\n            \"default\": \"\",\n            \"examples\": [\n                \"bar\"\n            ]\n        }\n    }\n}",
        "created_at": "2020-03-26T22:49:47+00:00",
        "updated_at": "2020-03-26T22:50:12+00:00"
    }],
    "meta": {
        "filter": "",
        "sort_by": "",
        "sort_order": "",
        "count": 2,
        "total_pages": 1,
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "path": "http:\/\/pm.local.processmaker.com\/api\/1.0\/vocabularies",
        "per_page": 10,
        "to": 2,
        "total": 2
    }
}