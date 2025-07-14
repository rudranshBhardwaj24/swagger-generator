import React, { useState } from "react";

// Your existing SchemaForm component
function SchemaForm({ onAddSchema, schemas }) {
  const [schemaName, setSchemaName] = useState("");
  const [properties, setProperties] = useState([]);
  const [property, setProperty] = useState({
    name: "",
    type: "string",
    required: false,
    isArray: false,
    arrayItemType: "string",
    refSchema: "",
  });

  const addProperty = () => {
    if (!property.name) return;
    setProperties([...properties, property]);
    setProperty({
      name: "",
      type: "string",
      required: false,
      isArray: false,
      arrayItemType: "string",
      refSchema: "",
    });
  };

  const removeProperty = (index) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!schemaName || properties.length === 0) return;
    const schema = {
      name: schemaName,
      properties: properties,
    };
    onAddSchema(schema);
    setSchemaName("");
    setProperties([]);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Schema</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Schema Name"
          value={schemaName}
          onChange={(e) => setSchemaName(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />

        <div className="border border-gray-200 rounded p-4">
          <h3 className="font-medium mb-2">Add Property</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <input
              type="text"
              placeholder="Property Name"
              value={property.name}
              onChange={(e) =>
                setProperty({ ...property, name: e.target.value })
              }
              className="border border-gray-300 rounded p-2 flex-1 min-w-[150px]"
            />
            <select
              value={property.type}
              onChange={(e) =>
                setProperty({ ...property, type: e.target.value })
              }
              className="border border-gray-300 rounded p-2"
            >
              <option value="string">string</option>
              <option value="integer">integer</option>
              <option value="boolean">boolean</option>
              <option value="$ref">$ref</option>
            </select>
            <label className="flex items-center gap-1 whitespace-nowrap">
              <input
                type="checkbox"
                checked={property.required}
                onChange={(e) =>
                  setProperty({ ...property, required: e.target.checked })
                }
              />
              Required
            </label>
            <label className="flex items-center gap-1 whitespace-nowrap">
              <input
                type="checkbox"
                checked={property.isArray}
                onChange={(e) =>
                  setProperty({ ...property, isArray: e.target.checked })
                }
              />
              Is Array
            </label>
          </div>

          {property.isArray && (
            <div className="flex gap-2 mb-2">
              <select
                value={property.arrayItemType}
                onChange={(e) =>
                  setProperty({ ...property, arrayItemType: e.target.value })
                }
                className="border border-gray-300 rounded p-2"
              >
                <option value="string">string</option>
                <option value="integer">integer</option>
                <option value="boolean">boolean</option>
                <option value="$ref">$ref</option>
              </select>

              {property.arrayItemType === "$ref" && (
                <select
                  value={property.refSchema}
                  onChange={(e) =>
                    setProperty({ ...property, refSchema: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2"
                >
                  <option value="">Select Schema</option>
                  {schemas.map((schema, index) => (
                    <option key={index} value={schema.name}>
                      {schema.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {property.type === "$ref" && (
            <select
              value={property.refSchema}
              onChange={(e) =>
                setProperty({ ...property, refSchema: e.target.value })
              }
              className="border border-gray-300 rounded p-2 mb-2"
            >
              <option value="">Select Schema</option>
              {schemas.map((schema, index) => (
                <option key={index} value={schema.name}>
                  {schema.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={addProperty}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            + Add Property
          </button>
        </div>

        {properties.length > 0 && (
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium mb-2">Properties</h3>
            <ul className="space-y-1">
              {properties.map((prop, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span>
                    <strong>{prop.name}</strong> (
                    {prop.isArray ? "array of " : ""}
                    {prop.type === "$ref" ? prop.refSchema : prop.type})
                    {prop.required ? " [required]" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeProperty(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Schema
        </button>
      </form>
    </div>
  );
}
export default SchemaForm;
