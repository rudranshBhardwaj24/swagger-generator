import React, { useState } from "react";
import SchemaForm from "./components/SchemaForm";
import SchemasList from "./components/SchemasList";
import SwaggerPreview from "./components/SwaggerPreview";
import DownloadButton from "./components/DownloadButton";

function App() {
  const [schemas, setSchemas] = useState([]);

  const addSchema = (schema) => {
    setSchemas([...schemas, schema]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Swagger Schema Creator</h1>
      <SchemaForm onAddSchema={addSchema} />
      <SchemasList schemas={schemas} />
      <SwaggerPreview schemas={schemas} />
      <DownloadButton schemas={schemas} />
    </div>
  );
}

export default App;
