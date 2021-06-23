export default function deepInclude(including: JsonValue, included: JsonValue): boolean {
  if (typeof including !== typeof included) {
    return false
  }
  if (
    typeof including === 'number' ||
    typeof including === 'string' ||
    typeof including === 'number' ||
    including === null
  ) {
    return including === included
  }
  if (Array.isArray(included)) {
    return included.every((_, idx) => deepInclude((including as JsonValueArray)[idx], included[idx]))
  }
  return Object.keys(included as JsonValueObject).every(
    (key) =>
      Object.keys(including).includes(key) &&
      deepInclude((including as JsonValueObject)[key], (included as JsonValueObject)[key])
  )
}
