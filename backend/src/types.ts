import { JsonObject } from "@prisma/client/runtime/library";

export type User = {
  id: Number;
  name: string;
  email: string;
  password: string;
  cash: Number;
  portfolio: JsonObject;
  verified: boolean;
};

// model User {
//     id    Int     @id @default(autoincrement())
//     name  String
//     email String  @unique
//     password String
//     cash Float?
//     portfolio Json?
//     verified Boolean @default(false)
//   }
