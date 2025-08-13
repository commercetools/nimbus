import isPlainObject from "is-plain-obj";

/** Chakra requires that tokens be defined using a specific syntax/structure, e.g.:
 * ```
 *   fonts: {
 *      body: { value: "system-ui, sans-serif" },
 *    },
 * ```
 * While similar to the DTCG tokens spec, this syntax has one significant difference:
 * it does not use a `$` as the first character of the defined key.
 * E.g. `value: 2px` as opposed to `$value: 2px`
 *
 * This function parses our base token object and returns `value` instead of `$value`,
 * as well as removing all "meta" keys that style-dictionary adds during its'
 * parsing/pre-processing lifecycles.*/

export function formatDTCGforChakra(tokens) {
  /**clone all tokens */
  const clone = globalThis.structuredClone
    ? globalThis.structuredClone(tokens)
    : JSON.parse(JSON.stringify(tokens));

  const isDarkLightPair = (obj) => {
    return (
      isPlainObject(obj) &&
      Object.prototype.hasOwnProperty.call(obj, "dark") &&
      Object.prototype.hasOwnProperty.call(obj, "light") &&
      Object.keys(obj).length === 2
    );
  };

  const format = (slice) => {
    /** if object has a $value key, it is a leaf node and should be transformed */
    if (Object.prototype.hasOwnProperty.call(slice, "$value")) {
      /** store $value as value */
      slice.value = slice.$value;
      /** delete all keys except value, since they are not valid in building chakra theme values */
      Object.keys(slice).forEach((key) => {
        if (key && key !== "value") delete slice[key];
      });
      /** if object does not have a $value key, it is not a leaf node. */
    } else if (isDarkLightPair(slice)) {
      const processToken = (token) => {
        if (Object.prototype.hasOwnProperty.call(token, "$value")) {
          return token.$value;
        }
        const result = {};
        for (const [key, value] of Object.entries(token)) {
          if (isPlainObject(value)) {
            result[key] = { value: processToken(value) };
          }
        }
        return result;
      };

      const lightValues = processToken(slice.light);
      const darkValues = processToken(slice.dark);

      const combineValues = (light, dark) => {
        if (typeof light !== "object" || light === null) {
          return { _light: light, _dark: dark };
        }
        const result = {};
        for (const key in light) {
          result[key] = {
            value: combineValues(
              light[key]?.value || light[key],
              dark[key]?.value || dark[key]
            ),
          };
        }
        return result;
      };

      const combined = combineValues(lightValues, darkValues);
      Object.assign(slice, combined);
      delete slice.light;
      delete slice.dark;
    } else {
      Object.values(slice).forEach((val) => {
        /** if child is an object, run format fn on it to see if it has $value key */
        if (isPlainObject(val)) {
          format(val);
        }
      });
    }
  };
  /** run format recursively over tokens */
  format(clone);

  return clone;
}
