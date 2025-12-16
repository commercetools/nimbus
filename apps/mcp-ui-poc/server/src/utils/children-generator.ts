import type { ChildElement } from "../types/index";
import { escapeForJS } from "./escape-for-js";

/**
 * Generate Remote DOM script for creating child elements
 * @param children Array of child element definitions
 * @param parentVar Variable name of parent element to append to
 * @returns JavaScript code string
 */
export function generateChildrenScript(
  children: ChildElement[],
  parentVar: string
): string {
  return children
    .map((child, index) => {
      // Use parent variable name as prefix to ensure unique variable names in nested structures
      const childVar = `${parentVar}_child_${index}`;
      let script = "";

      switch (child.type) {
        case "heading": {
          const escapedContent = escapeForJS(child.content);
          script = `
    const ${childVar} = document.createElement('nimbus-heading');
    ${child.size ? `${childVar}.setAttribute('size', '${child.size}');` : ""}
    ${child.marginBottom ? `${childVar}.setAttribute('margin-bottom', '${child.marginBottom}');` : ""}
    ${childVar}.textContent = '${escapedContent}';
    ${parentVar}.appendChild(${childVar});`;
          break;
        }

        case "text": {
          const escapedContent = escapeForJS(child.content);
          script = `
    const ${childVar} = document.createElement('nimbus-text');
    ${child.fontSize ? `${childVar}.setAttribute('font-size', '${child.fontSize}');` : ""}
    ${child.fontWeight ? `${childVar}.setAttribute('font-weight', '${child.fontWeight}');` : ""}
    ${child.color ? `${childVar}.setAttribute('color', '${child.color}');` : ""}
    ${child.marginBottom ? `${childVar}.setAttribute('margin-bottom', '${child.marginBottom}');` : ""}
    ${childVar}.textContent = '${escapedContent}';
    ${parentVar}.appendChild(${childVar});`;
          break;
        }

        case "button": {
          const escapedLabel = escapeForJS(child.label);
          script = `
    const ${childVar} = document.createElement('nimbus-button');
    ${childVar}.setAttribute('variant', '${child.variant || "solid"}');
    ${childVar}.setAttribute('color-palette', '${child.colorPalette || "primary"}');
    ${child.width ? `${childVar}.setAttribute('width', '${child.width}');` : ""}
    ${child.isDisabled ? `${childVar}.setAttribute('is-disabled', 'true');` : ""}
    ${childVar}.textContent = '${escapedLabel}';
    ${childVar}.setAttribute('data-label', '${escapedLabel}');
    ${parentVar}.appendChild(${childVar});`;
          break;
        }

        case "badge": {
          const escapedLabel = escapeForJS(child.label);
          script = `
    const ${childVar} = document.createElement('nimbus-badge');
    ${childVar}.setAttribute('color-palette', '${child.colorPalette || "primary"}');
    ${childVar}.setAttribute('size', '${child.size || "md"}');
    ${child.width ? `${childVar}.setAttribute('width', '${child.width}');` : ""}
    ${childVar}.textContent = '${escapedLabel}';
    ${parentVar}.appendChild(${childVar});`;
          break;
        }

        case "stack":
          script = `
    const ${childVar} = document.createElement('nimbus-stack');
    ${childVar}.setAttribute('direction', '${child.direction || "column"}');
    ${child.gap ? `${childVar}.setAttribute('gap', '${child.gap}');` : ""}
    ${child.width ? `${childVar}.setAttribute('width', '${child.width}');` : ""}
    ${child.marginBottom ? `${childVar}.setAttribute('margin-bottom', '${child.marginBottom}');` : ""}
    ${child.children ? generateChildrenScript(child.children, childVar) : ""}
    ${parentVar}.appendChild(${childVar});`;
          break;

        case "flex":
          script = `
    const ${childVar} = document.createElement('nimbus-flex');
    ${childVar}.setAttribute('direction', '${child.direction || "row"}');
    ${child.gap ? `${childVar}.setAttribute('gap', '${child.gap}');` : ""}
    ${child.padding ? `${childVar}.setAttribute('padding', '${child.padding}');` : ""}
    ${child.backgroundColor ? `${childVar}.setAttribute('background-color', '${child.backgroundColor}');` : ""}
    ${child.children ? generateChildrenScript(child.children, childVar) : ""}
    ${parentVar}.appendChild(${childVar});`;
          break;

        case "card":
          script = `
    const ${childVar} = document.createElement('nimbus-card-root');
    ${childVar}.setAttribute('elevation', '${child.elevation || "elevated"}');
    ${childVar}.setAttribute('border-style', '${child.borderStyle || "outlined"}');
    ${child.cardPadding ? `${childVar}.setAttribute('card-padding', '${child.cardPadding}');` : ""}
    ${child.maxWidth ? `${childVar}.setAttribute('max-width', '${child.maxWidth}');` : ""}
    ${child.width ? `${childVar}.setAttribute('width', '${child.width}');` : ""}

    const ${childVar}_content = document.createElement('nimbus-card-content');
    ${child.children ? generateChildrenScript(child.children, `${childVar}_content`) : ""}
    ${childVar}.appendChild(${childVar}_content);
    ${parentVar}.appendChild(${childVar});`;
          break;

        case "formField": {
          const escapedDescription = child.description
            ? escapeForJS(child.description)
            : undefined;
          const escapedErrorMessage = child.errorMessage
            ? escapeForJS(child.errorMessage)
            : undefined;

          // Special handling for label children - if they're all simple text, set textContent directly
          const allTextChildren =
            child.labelChildren.every((lc) => lc.type === "text") &&
            child.labelChildren.length > 0;
          const labelTextContent = allTextChildren
            ? child.labelChildren
                .map((lc) => (lc.type === "text" ? lc.content : ""))
                .join(" ")
            : undefined;

          script = `
    const ${childVar} = document.createElement('nimbus-form-field-root');
    ${child.isRequired ? `${childVar}.setAttribute('is-required', 'true');` : ""}
    ${child.isInvalid ? `${childVar}.setAttribute('is-invalid', 'true');` : ""}
    ${child.isDisabled ? `${childVar}.setAttribute('is-disabled', 'true');` : ""}
    ${child.isReadOnly ? `${childVar}.setAttribute('is-read-only', 'true');` : ""}
    ${child.size ? `${childVar}.setAttribute('size', '${child.size}');` : ""}
    ${child.direction ? `${childVar}.setAttribute('direction', '${child.direction}');` : ""}

    const ${childVar}_label = document.createElement('nimbus-form-field-label');
    ${
      labelTextContent
        ? `${childVar}_label.textContent = '${escapeForJS(labelTextContent)}';`
        : generateChildrenScript(child.labelChildren, `${childVar}_label`)
    }
    ${childVar}.appendChild(${childVar}_label);

    const ${childVar}_input = document.createElement('nimbus-form-field-input');
    ${generateChildrenScript(child.inputChildren, `${childVar}_input`)}
    ${childVar}.appendChild(${childVar}_input);

    ${
      escapedDescription
        ? `
    const ${childVar}_description = document.createElement('nimbus-form-field-description');
    ${childVar}_description.textContent = '${escapedDescription}';
    ${childVar}.appendChild(${childVar}_description);`
        : ""
    }

    ${
      escapedErrorMessage
        ? `
    const ${childVar}_error = document.createElement('nimbus-form-field-error');
    ${childVar}_error.textContent = '${escapedErrorMessage}';
    ${childVar}.appendChild(${childVar}_error);`
        : ""
    }

    ${parentVar}.appendChild(${childVar});`;
          break;
        }

        case "textInput": {
          const escapedName = child.name ? escapeForJS(child.name) : undefined;
          const escapedPlaceholder = child.placeholder
            ? escapeForJS(child.placeholder)
            : undefined;
          const escapedDefaultValue = child.defaultValue
            ? escapeForJS(child.defaultValue)
            : undefined;

          script = `
    const ${childVar} = document.createElement('nimbus-text-input');
    ${escapedName ? `${childVar}.setAttribute('name', '${escapedName}');` : ""}
    ${escapedPlaceholder ? `${childVar}.setAttribute('placeholder', '${escapedPlaceholder}');` : ""}
    ${escapedDefaultValue ? `${childVar}.setAttribute('value', '${escapedDefaultValue}');` : ""}
    ${child.isRequired ? `${childVar}.setAttribute('is-required', 'true');` : ""}
    ${child.isDisabled ? `${childVar}.setAttribute('is-disabled', 'true');` : ""}
    ${child.isReadOnly ? `${childVar}.setAttribute('is-read-only', 'true');` : ""}
    ${child.inputType ? `${childVar}.setAttribute('type', '${child.inputType}');` : ""}
    ${parentVar}.appendChild(${childVar});`;
          break;
        }
      }

      return script;
    })
    .join("\n");
}
