(function loadOpenAPIRoutes(){
    if (!loadOpenAPIRoutes.loaded){
      let backend = CONFIG.get("backend");
      if (typeof backend === "undefined"){
        backend = {};
      }
      if (typeof backend.routes === "undefined"){
        backend.routes = [];
      }
      backend.routes = backend.routes.concat([{
        "name": "OpenAPI3.JSON",
        "description": "Open API v3 JSON",
        "path": "^/openapi.json$",
        "microservice": "qcobjects-handler-openapi/api/com.qcobjects.backend.microservice.openapi.json"
      },
      {
        "name": "OpenAPI3.YAML",
        "description": "Open API v3 YAML",
        "path": "^/openapi.yaml$",
        "microservice": "qcobjects-handler-openapi/api/com.qcobjects.backend.microservice.openapi.yaml"
      }]);
      CONFIG.set("backend", backend);
      loadOpenAPIRoutes.loaded = true;
    }
  })();
  