import React, { useState } from "react";

function SwaggerForm({ schemas, onGenerateSwagger }) {
  const [swaggerInfo, setSwaggerInfo] = useState({
    title: "My API",
    description: "API Documentation",
    version: "1.0.0",
    host: "localhost:3000",
    basePath: "/api",
    schemes: ["http"],
  });

  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState({
    path: "",
    method: "GET",
    summary: "",
    description: "",
    tags: [],
    parameters: [],
    responses: {
      200: {
        description: "Success",
        schema: "",
      },
    },
  });

  const [currentParameter, setCurrentParameter] = useState({
    name: "",
    in: "query",
    type: "string",
    required: false,
    description: "",
  });

  const addParameter = () => {
    if (!currentParameter.name) return;
    setCurrentPath({
      ...currentPath,
      parameters: [...currentPath.parameters, currentParameter],
    });
    setCurrentParameter({
      name: "",
      in: "query",
      type: "string",
      required: false,
      description: "",
    });
  };

  const removeParameter = (index) => {
    setCurrentPath({
      ...currentPath,
      parameters: currentPath.parameters.filter((_, i) => i !== index),
    });
  };

  const addPath = () => {
    if (!currentPath.path) return;
    setPaths([...paths, currentPath]);
    setCurrentPath({
      path: "",
      method: "GET",
      summary: "",
      description: "",
      tags: [],
      parameters: [],
      responses: {
        200: {
          description: "Success",
          schema: "",
        },
      },
    });
  };

  const removePath = (index) => {
    setPaths(paths.filter((_, i) => i !== index));
  };

  const handleGenerateSwagger = () => {
    const swaggerDoc = {
      swagger: "2.0",
      info: {
        title: swaggerInfo.title,
        description: swaggerInfo.description,
        version: swaggerInfo.version,
      },
      host: swaggerInfo.host,
      basePath: swaggerInfo.basePath,
      schemes: swaggerInfo.schemes,
      paths: {},
      definitions: {},
    };

    // Add schemas as definitions
    schemas.forEach((schema) => {
      swaggerDoc.definitions[schema.name] = {
        type: "object",
        properties: {},
        required: [],
      };

      schema.properties.forEach((prop) => {
        if (prop.isArray) {
          swaggerDoc.definitions[schema.name].properties[prop.name] = {
            type: "array",
            items:
              prop.arrayItemType === "$ref"
                ? { $ref: `#/definitions/${prop.refSchema}` }
                : { type: prop.arrayItemType },
          };
        } else if (prop.type === "$ref") {
          swaggerDoc.definitions[schema.name].properties[prop.name] = {
            $ref: `#/definitions/${prop.refSchema}`,
          };
        } else {
          swaggerDoc.definitions[schema.name].properties[prop.name] = {
            type: prop.type,
          };
        }

        if (prop.required) {
          swaggerDoc.definitions[schema.name].required.push(prop.name);
        }
      });
    });

    // Add paths
    paths.forEach((pathItem) => {
      if (!swaggerDoc.paths[pathItem.path]) {
        swaggerDoc.paths[pathItem.path] = {};
      }

      swaggerDoc.paths[pathItem.path][pathItem.method.toLowerCase()] = {
        summary: pathItem.summary,
        description: pathItem.description,
        parameters: pathItem.parameters,
        responses: pathItem.responses,
      };
    });

    onGenerateSwagger(swaggerDoc);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Swagger Documentation Generator</h2>

      {/* API Information */}
      <div className="border border-gray-200 rounded p-4">
        <h3 className="font-medium mb-3">API Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="API Title"
            value={swaggerInfo.title}
            onChange={(e) =>
              setSwaggerInfo({ ...swaggerInfo, title: e.target.value })
            }
            className="border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            placeholder="Version"
            value={swaggerInfo.version}
            onChange={(e) =>
              setSwaggerInfo({ ...swaggerInfo, version: e.target.value })
            }
            className="border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            placeholder="Host"
            value={swaggerInfo.host}
            onChange={(e) =>
              setSwaggerInfo({ ...swaggerInfo, host: e.target.value })
            }
            className="border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            placeholder="Base Path"
            value={swaggerInfo.basePath}
            onChange={(e) =>
              setSwaggerInfo({ ...swaggerInfo, basePath: e.target.value })
            }
            className="border border-gray-300 rounded p-2"
          />
        </div>
        <textarea
          placeholder="API Description"
          value={swaggerInfo.description}
          onChange={(e) =>
            setSwaggerInfo({ ...swaggerInfo, description: e.target.value })
          }
          className="border border-gray-300 rounded p-2 w-full mt-2"
          rows="2"
        />
      </div>

      {/* Add Endpoint */}
      <div className="border border-gray-200 rounded p-4">
        <h3 className="font-medium mb-3">Add API Endpoint</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Path (e.g., /users/{id})"
            value={currentPath.path}
            onChange={(e) =>
              setCurrentPath({ ...currentPath, path: e.target.value })
            }
            className="border border-gray-300 rounded p-2"
          />
          <select
            value={currentPath.method}
            onChange={(e) =>
              setCurrentPath({ ...currentPath, method: e.target.value })
            }
            className="border border-gray-300 rounded p-2"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
          <input
            type="text"
            placeholder="Summary"
            value={currentPath.summary}
            onChange={(e) =>
              setCurrentPath({ ...currentPath, summary: e.target.value })
            }
            className="border border-gray-300 rounded p-2"
          />
          <select
            value={currentPath.responses["200"].schema}
            onChange={(e) =>
              setCurrentPath({
                ...currentPath,
                responses: {
                  ...currentPath.responses,
                  200: {
                    ...currentPath.responses["200"],
                    schema: e.target.value,
                  },
                },
              })
            }
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Select Response Schema</option>
            {schemas.map((schema, index) => (
              <option key={index} value={schema.name}>
                {schema.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          placeholder="Description"
          value={currentPath.description}
          onChange={(e) =>
            setCurrentPath({ ...currentPath, description: e.target.value })
          }
          className="border border-gray-300 rounded p-2 w-full mb-4"
          rows="2"
        />

        {/* Parameters */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Parameters</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            <input
              type="text"
              placeholder="Parameter Name"
              value={currentParameter.name}
              onChange={(e) =>
                setCurrentParameter({
                  ...currentParameter,
                  name: e.target.value,
                })
              }
              className="border border-gray-300 rounded p-2 flex-1 min-w-[120px]"
            />
            <select
              value={currentParameter.in}
              onChange={(e) =>
                setCurrentParameter({ ...currentParameter, in: e.target.value })
              }
              className="border border-gray-300 rounded p-2"
            >
              <option value="query">Query</option>
              <option value="path">Path</option>
              <option value="header">Header</option>
              <option value="body">Body</option>
            </select>
            <select
              value={currentParameter.type}
              onChange={(e) =>
                setCurrentParameter({
                  ...currentParameter,
                  type: e.target.value,
                })
              }
              className="border border-gray-300 rounded p-2"
            >
              <option value="string">string</option>
              <option value="integer">integer</option>
              <option value="boolean">boolean</option>
            </select>
            <label className="flex items-center gap-1 whitespace-nowrap">
              <input
                type="checkbox"
                checked={currentParameter.required}
                onChange={(e) =>
                  setCurrentParameter({
                    ...currentParameter,
                    required: e.target.checked,
                  })
                }
              />
              Required
            </label>
            <button
              type="button"
              onClick={addParameter}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Add Parameter
            </button>
          </div>

          {currentPath.parameters.length > 0 && (
            <div className="space-y-1">
              {currentPath.parameters.map((param, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span>
                    <strong>{param.name}</strong> ({param.in}) - {param.type}
                    {param.required ? " [required]" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeParameter(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={addPath}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Endpoint
        </button>
      </div>

      {/* Endpoints List */}
      {paths.length > 0 && (
        <div className="border border-gray-200 rounded p-4">
          <h3 className="font-medium mb-3">API Endpoints</h3>
          <div className="space-y-2">
            {paths.map((path, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded"
              >
                <div>
                  <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                    {path.method}
                  </span>
                  <span className="font-medium">{path.path}</span>
                  <span className="text-gray-600 ml-2">{path.summary}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removePath(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleGenerateSwagger}
        className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 font-medium"
      >
        Generate Swagger Documentation
      </button>
    </div>
  );
}

export default SwaggerForm;
