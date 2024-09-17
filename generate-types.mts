import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// Define the Strapi endpoint and the output directory for generated types
const STRAPI_API_URL = 'http://localhost:1338'; // Replace with your Strapi URL
const OUTPUT_DIR = './types/generated'; // Directory to save generated types

// Helper function to convert Strapi field types to TypeScript types
const convertStrapiTypeToTsType = (strapiType: string): string => {
  switch (strapiType) {
    case 'string':
    case 'text':
    case 'richtext':
      return 'string';
    case 'integer':
    case 'biginteger':
    case 'decimal':
    case 'float':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
    case 'datetime':
    case 'time':
      return 'Date';
    case 'json':
      return 'Record<string, any>';
    case 'relation':
      return 'any'; // You might need to handle relations differently
    default:
      return 'any';
  }
};

// Fetch content types from Strapi
const fetchContentTypes = async () => {
  try {
    const response = await axios.get(`${STRAPI_API_URL}/api/content-type-builder/content-types`, {
      headers: {
        Authorization: `Bearer 186801ad14624cb8c38ee9e76131b2e2df5a9370cfa39e7b459206432ce0d51b8b64023d0f5f114d7b7a57e93979daa14850828103e6b05be7e31c09e0b2121c3be70107d4a51cb1c5852193f9378091ec40f17d7ceea50a9f456610713d21c36173f58316c87add07c84449ba3a723a414ac4c24c78264cf28a517bfd2acd0a`, // Replace with your API token if needed
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching content types:', error);
    return [];
  }
};

// Generate TypeScript interfaces from Strapi content types
const generateTsInterfaces = (contentTypes: any[]) => {
  return contentTypes.map((contentType) => {
    const { schema } = contentType;

    // Convert each attribute to a TypeScript property
    const properties = Object.entries(schema.attributes)
      .map(([name, attribute]: [string, any]) => {
        const tsType = convertStrapiTypeToTsType(attribute.type);
        return `  ${name}: ${tsType};`;
      })
      .join('\n');

    return `export interface ${schema.displayName} {\n${properties}\n}\n`;
  }).join('\n');
};

// Main function to generate TypeScript types
const generateTypes = async () => {
  // Fetch content types
  const contentTypes = await fetchContentTypes();

  // Generate TypeScript interfaces
  const tsInterfaces = generateTsInterfaces(contentTypes);

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Write interfaces to file
  fs.writeFileSync(path.join(OUTPUT_DIR, 'strapi-types.d.ts'), tsInterfaces);

  console.log('TypeScript types generated successfully!');
};

generateTypes();
