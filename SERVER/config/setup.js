import { client, connectDB } from "./db.js";

const db = await connectDB();

await db.command({
  collMod: "users",
  validator: {
    $jsonSchema: {
      title: "validation error for users collection",
      required: ["_id", "name", "email", "password", "rootDirId"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Please Enter a Valid Id",
        },
        name: {
          bsonType: "string",
          description: "Please Enter a Name atleast three character",
          minLength: 3,
        },
        email: {
          bsonType: "string",
          description: "Please Enter a Valid Email",
          pattern: "^(?!.*..)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$",
        },
        password: {
          bsonType: "string",
          description: "Password will be 8 character long",
          minLength: 4,
        },
        rootDirId: {
          bsonType: "objectId",
          description: "Please Enter a Valid rootDirId",
        },
      },
      additionalProperties: false,
    },
  },
});

await db.command({
  collMod: "files",
  validator: {
    $jsonSchema: {
      title: "validation error for files collection",
      required: ["_id", "name", "extname", "parentDirId", "userId"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Please Enter a Valid Id",
        },
        name: {
          bsonType: "string",
          description: "Please Enter a Name",
        },
        extname: {
          bsonType: "string",
          description: "Please Enter a extension name",
        },
        parentDirId: {
          bsonType: "objectId",
          description: "Please Enter a Valid parentDirId",
        },
        userId: {
          bsonType: "objectId",
          description: "Please Enter a Valid userId",
        },
      },
      additionalProperties: false,
    },
  },
});

await db.command({
  collMod: "directories",
  validator: {
    $jsonSchema: {
      title: "validation error for directories collection",
      required: ["_id", "name", "userId", "parentDirId"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Please Enter a Valid Id",
        },
        name: {
          bsonType: "string",
          description: "Please Enter a Name",
        },
        userId: {
          bsonType: "objectId",
          description: "Please Enter a Valid userId",
        },
        parentDirId: {
          bsonType: ['objectId', 'null'],
          description: "Please Enter a Valid parentDirId",
        },
      },
      additionalProperties: false,
    },
  },
});

console.log('Setup successfully done.')
await client.close();
