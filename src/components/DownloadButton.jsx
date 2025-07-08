import React from "react";
import { saveAs } from "file-saver";

function DownloadButton({ schemas }) {
  const downloadJSON = () => {
    const swaggerComponents = schemas.reduce((acc, schema) => {
      acc[schema.name] = {
        type: "object",
        properties: {},
        required: [],
      };
      schema.properties.forEach((prop) => {
        acc[schema.name].properties[prop.name] = { type: prop.type };
        if (prop.required) {
          acc[schema.name].required.push(prop.name);
        }
      });
      if (acc[schema.name].required.length === 0) {
        delete acc[schema.name].required;
      }
      return acc;
    }, {});
    const blob = new Blob(
      [JSON.stringify({ components: { schemas: swaggerComponents } }, null, 2)],
      { type: "application/json" }
    );
    saveAs(blob, "swagger-schema.json");
  };

  return (
    <button
      onClick={downloadJSON}
      className="bg-purple-500 text-white px-4 py-2 rounded"
    >
      Download Swagger JSON
    </button>
  );
}

export default DownloadButton;
