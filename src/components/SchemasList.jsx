function SchemasList({ schemas }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Added Schemas</h2>
      <ul className="list-disc pl-6">
        {schemas.map((schema, idx) => (
          <li key={idx}>
            <strong>{schema.name}</strong>
            <ul className="list-disc pl-6">
              {schema.properties.map((prop, pIdx) => (
                <li key={pIdx}>
                  {prop.name} ({prop.type}) {prop.required ? "[required]" : ""}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SchemasList;
