import { documentStateDescriptions } from "@/schemas/mdx-document-states";
import { useEffect, useMemo } from "react";
import { useDocumentMetaSettings } from "../use-document-meta-settings";
import { Text } from "@bleh-ui/react";

export const DocumentStateSelector = () => {
  const { meta, noDoc, save } = useDocumentMetaSettings();
  const options = useMemo(() => {
    const arr = Object.keys(documentStateDescriptions).map((key) => {
      const item = documentStateDescriptions[key];
      return {
        id: key,
        value: key,
        ...item,
      };
    });
    return arr;
  }, []);

  const onSaveRequest = (value) => {
    const payload = { ...meta, documentState: value };
    save(payload);
  };

  useEffect(() => {
    if (!meta) return;
    if (meta.documentState === undefined) {
      onSaveRequest(options[0].id);
    }
  }, [meta, options]);

  if (noDoc) return null;
  return (
    <>
      <Text as="label">Document Status</Text>
      <select
        value={meta?.documentState}
        onChange={(e) => onSaveRequest(e.target.value)}
      >
        {options.map(({ id, label, order }) => {
          return (
            <option key={id} value={id}>
              {order}. {label}
            </option>
          );
        })}
      </select>
    </>
  );
};
