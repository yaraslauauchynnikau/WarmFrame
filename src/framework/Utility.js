function verifyEnumObjectType(value, enumType) {
    if (!enumType.exists(value)) {
        throw new Error(`Invalid value: ${value}. Expected one of: ${enumType.values().join(', ')}`);
    }
}