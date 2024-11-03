module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/?(*.)+(spec|test).ts'], // шаблон для поиска тестов
    transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }], // используем tsconfig.json
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/assets/$1', // алиас для путей
    },
};