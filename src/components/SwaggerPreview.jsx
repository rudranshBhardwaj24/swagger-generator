import React from "react";

function SwaggerPreview({ schemas }) {
  const swaggerComponents = schemas.reduce((acc, schema) => {
    acc[schema.name] = {
      type: "object",
      properties: {},
      required: [],
    };

    schema.properties.forEach((prop) => {
      // 🆕 Handle array properties
      if (prop.isArray) {
        if (prop.arrayItemType === "$ref") {
          // Array of objects with $ref
          acc[schema.name].properties[prop.name] = {
            type: "array",
            items: {
              $ref: `#/components/schemas/${prop.refSchema}`,
            },
          };
        } else {
          // Array of primitives
          acc[schema.name].properties[prop.name] = {
            type: "array",
            items: {
              type: prop.arrayItemType,
            },
          };
        }
      }
      // 🆕 Handle $ref for non-array properties
      else if (prop.type === "$ref") {
        acc[schema.name].properties[prop.name] = {
          $ref: `#/components/schemas/${prop.refSchema}`,
        };
      }
      // ✅ Normal primitive property
      else {
        acc[schema.name].properties[prop.name] = { type: prop.type };
      }

      if (prop.required) {
        acc[schema.name].required.push(prop.name);
      }
    });

    if (acc[schema.name].required.length === 0) {
      delete acc[schema.name].required;
    }

    return acc;
  }, {});

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Swagger Preview</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {JSON.stringify(
          { components: { schemas: swaggerComponents } },
          null,
          2
        )}
      </pre>
    </div>
  );
}

export default SwaggerPreview;
