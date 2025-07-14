import React from "react";
import { useState } from "react";
import SchemaForm from "./components/SchemaForm";
import SchemasList from "./components/SchemasList";
import SwaggerPreview from "./components/SwaggerPreview";
import DownloadButton from "./components/DownloadButton";
import SwaggerForm from "./components/SwaggerForm";

function App() {
  const [activeTab, setActiveTab] = useState("schema");
  const [schemas, setSchemas] = useState([]);
  const [swaggerDoc, setSwaggerDoc] = useState(null);

  const handleAddSchema = (schema) => {
    setSchemas([...schemas, schema]);
  };

  const handleGenerateSwagger = (swagger) => {
    setSwaggerDoc(swagger);
  };

  const removeSchema = (index) => {
    setSchemas(schemas.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Swagger Generator</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("schema")}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === "schema"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Schema Generation
        </button>
        <button
          onClick={() => setActiveTab("swagger")}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === "swagger"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Swagger Generation
        </button>
      </div>

      {/* Current Schemas */}
      {schemas.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">
            Current Schemas ({schemas.length})
          </h3>
          <div className="space-y-2">
            {schemas.map((schema, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-2 rounded"
              >
                <span className="font-medium">{schema.name}</span>
                <button
                  onClick={() => removeSchema(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "schema" && (
        <SchemaForm onAddSchema={handleAddSchema} schemas={schemas} />
      )}

      {activeTab === "swagger" && (
        <SwaggerForm
          schemas={schemas}
          onGenerateSwagger={handleGenerateSwagger}
        />
      )}

      {/* Generated Swagger Documentation */}
      {swaggerDoc && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">Generated Swagger Documentation</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(swaggerDoc, null, 2)}
          </pre>
          <button
            onClick={() =>
              navigator.clipboard.writeText(JSON.stringify(swaggerDoc, null, 2))
            }
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
