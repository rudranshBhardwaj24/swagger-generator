import React, { useState } from "react";

function SchemaForm({ onAddSchema }) {
  const [schemaName, setSchemaName] = useState("");
  const [properties, setProperties] = useState([]);
  const [property, setProperty] = useState({
    name: "",
    type: "string",
    required: false,
  });

  const addProperty = () => {
    setProperties([...properties, property]);
    setProperty({ name: "", type: "string", required: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!schemaName) return;
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
      <h2 className="text-xl font-semibold mb-2">Add New Schema</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Schema Name"
          value={schemaName}
          onChange={(e) => setSchemaName(e.target.value)}
          className="border p-2 w-full"
        />

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Property Name"
            value={property.name}
            onChange={(e) => setProperty({ ...property, name: e.target.value })}
            className="border p-2 flex-1"
          />
          <select
            value={property.type}
            onChange={(e) => setProperty({ ...property, type: e.target.value })}
            className="border p-2"
          >
            <option value="string">string</option>
            <option value="integer">integer</option>
            <option value="boolean">boolean</option>
          </select>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={property.required}
              onChange={(e) =>
                setProperty({ ...property, required: e.target.checked })
              }
            />
            Required
          </label>
          <button
            type="button"
            onClick={addProperty}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            + Add Property
          </button>
        </div>

        <ul className="list-disc pl-6">
          {properties.map((prop, index) => (
            <li key={index}>
              {prop.name} ({prop.type}) {prop.required ? "[required]" : ""}
            </li>
          ))}
        </ul>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Schema
        </button>
      </form>
    </div>
  );
}

export default SchemaForm;
