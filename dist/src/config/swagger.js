"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ONG Sem Fome API',
            version: '1.0.0',
            description: 'API documentation for ONG Sem Fome project',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Donor: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        type: {
                            type: 'string',
                            enum: ['pessoa_fisica', 'pessoa_juridica'],
                        },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        cpf: { type: 'string' },
                        street_number: { type: 'string' },
                        street_complement: { type: 'string' },
                        street_neighborhood: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                        zip_code: { type: 'string' },
                        street_address: { type: 'string' },
                        observation: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    },
    apis: ['./src/modules/**/routes/*.ts', './src/modules/**/controllers/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
