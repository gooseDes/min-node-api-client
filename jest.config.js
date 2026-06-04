module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
    },
    transformIgnorePatterns: ["/node_modules/(?!(msw|@mswjs|rettime)/)"],
};
