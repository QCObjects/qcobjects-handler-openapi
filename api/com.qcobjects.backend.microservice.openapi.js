/**
 * QCObjects CLI 0.1.x
 * ________________
 *
 * Author: Jean Machuca <correojean@gmail.com>
 *
 * Cross Browser Javascript Framework for MVC Patterns
 * QuickCorp/QCObjects is licensed under the
 * GNU Lesser General Public License v3.0
 * [LICENSE] (https://github.com/QuickCorp/QCObjects/blob/master/LICENSE.txt)
 *
 * Permissions of this copyleft license are conditioned on making available
 * complete source code of licensed works and modifications under the same
 * license or the GNU GPLv3. Copyright and license notices must be preserved.
 * Contributors provide an express grant of patent rights. However, a larger
 * work using the licensed work through interfaces provided by the licensed
 * work may be distributed under different terms and without source code for
 * the larger work.
 *
 * Copyright (C) 2015 Jean Machuca,<correojean@gmail.com>
 *
 * Everyone is permitted to copy and distribute verbatim copies of this
 * license document, but changing it is not allowed.
*/
/*eslint no-unused-vars: "off"*/
/*eslint no-redeclare: "off"*/
/*eslint no-empty: "off"*/
/*eslint strict: "off"*/
/*eslint no-mixed-operators: "off"*/
/*eslint no-undef: "off"*/
/*eslint no-useless-escape: "off"*/
"use strict";
const fs = require("fs");
const os = require("os");
const { exec,execSync } = require("child_process");

Package("com.qcobjects.backend.microservice.openapi",[
  Class("OpenAPIMicroservice",BackendMicroservice,{
    body:null,
    tempFileName: "",
    get:function (){
      var microservice = this;
      var openapipaths = {};
      CONFIG.get("backend").routes.map(
        function (route){
          var openapipathname = (route.openapi_path)?(route.openapi_path):(route.path);
          var openapipathname = openapipathname.replace(/(\^)/g,"");
          var openapipathname = openapipathname.replace(/(\$)/g,"");
          var openapipathname = openapipathname.replace(/(\(\?\<)/g,"{");
          var openapipathname = openapipathname.replace(/(\>\.\*\))/g,"}");
          var openapiparams = [...openapipathname.matchAll(/{(.*?)}/g)].map(m=>m[1]);

          var openapiparams = openapiparams.map((paramname) =>
          {
            return {
              "name" : paramname,
              "in" : "path",
              "description" : paramname,
              "required" : true,
              "style" : "simple",
              "explode" : false,
              "schema" : {
                "type" : "string"
              }
            };
          });

          var openapipath = {};
          if (route.supported_methods){
            route.supported_methods.map(function (supportedmethod){
              openapipath[supportedmethod.toLowerCase()] = {
                "summary" : route.name,
                "description" : route.description,
                "parameters" : openapiparams,
                "responses" : {
                  "200" : {
                    "description" : "OK"
                  }
                },
                "security" : [ "read", "write" ]
              };
            });
          } else {
            openapipath["get"] = {
              "summary" : route.name,
              "description" : route.description,
              "parameters" : openapiparams,
              "responses" : {
                "200" : {
                  "description" : "OK"
                }
              },
              "security" : [ "read", "write" ]
            };
          }

          openapipaths[openapipathname] = openapipath;
        }
      );
      microservice.body = {
        "openapi" : "3.0.0",
        "info" : {
          "title" : CONFIG.get("title","Sample Application OpenAPI Spec from QCObjects"),
          "description" : CONFIG.get("description","This is a sample Open API made with QCObjects"),
          "version" : "1.0.0"
        },
        "servers" : [
          {
            "url" : `https://${CONFIG.get("domain")}/`,
            "description" : "QCObjects Open API V3 HTTPS"
          },
          {
            "url" : `http://${CONFIG.get("domain")}/`,
            "description" : "QCObjects Open API V3 HTTP"
          }
       ],
        "security" : [ {
          "application" : [ "read", "write" ]
        } ],
        "paths" : openapipaths,
        "components" : {
          "schemas" : {
            "ErrorModel": {
              "type": "object",
              "required": [
                "message",
                "code"
              ],
              "properties": {
                "message": {
                  "type": "string"
                },
                "code": {
                  "type": "integer",
                  "minimum": 100,
                  "maximum": 600
                }
              }
            }
          },
          "securitySchemes" : {
            "application" : {
              "type" : "oauth2",
              "flows" : {
                "clientCredentials" : {
                  "tokenUrl" : `https://${CONFIG.get("domain")}/oauth/token`,
                  "scopes" : {
                    "write" : "allows modifying resources",
                    "read" : "allows reading resources"
                  }
                }
              }
            }
          }
        }
      };
      microservice.done();
    }
  }),
  Class("Microservice",OpenAPIMicroservice)
]);
