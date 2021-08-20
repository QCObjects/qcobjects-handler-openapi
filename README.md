# QCObjects Handler for Open API

QCObjects Handler for Open API requests. This handler will allow you to make a
dynamic url like https://example.com/openapi.json

## Instructions

1. Install this dependency in your project using npm

```shell
npm i --save qcobjects-handler-openapi
```

2. In your config.json file, create the following paths

```shell
{
  "backend": {
    "routes": [{
        "name": "OpenAPI3.JSON",
        "description": "Open API v3 JSON",
        "path": "^/openapi.json$",
        "microservice": "com.qcobjects.backend.microservice.openapi.json"
      },
      {
        "name": "OpenAPI3.YAML",
        "description": "Open API v3 YAML",
        "path": "^/openapi.yaml$",
        "microservice": "com.qcobjects.backend.microservice.openapi.yaml"
      }
    ]
  }
}
```

3. Start the QCObjects HTTP2 Server

```shell
qcobjects-server
```

4. Visit https://example.com/openapi.json to view the result
