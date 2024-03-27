import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import casual from 'casual';

const typeDefs = `#graphql

schema {
  query: Query
  mutation: Mutation
}

interface Entity {
  id: ID!
  name: String!
}

type Contact implements Entity {
  id: ID!
  name: String!
  email: String!
  phone: String
}

type Company implements Entity {
  id: ID!
  name: String!
  industry: String!
  contactEmail: String
}

input CreateEntityInput {
  entityType: EntityType!
  name: String!
  email: String
  phone: String
  industry: String
  contactEmail: String
}

input UpdateEntityInput {
  id: ID!
  entityType: EntityType!
  name: String
  email: String
  phone: String
  industry: String
  contactEmail: String
}

enum EntityType {
  CONTACT
  COMPANY
}

type Mutation {
  createEntity(input: CreateEntityInput): Entity
  updateEntity(input: UpdateEntityInput): Entity
}

type Query {
  getEntities: [Entity]
  getEntity(id: ID!): Entity
}
`;

const contacts = [... new Array(10)].map(() => ({
  id: casual.uuid,
  name: casual.full_name,
  email: casual.email,
  phone: casual.phone,
  __typename: "Contact"
}))

const companies = [... new Array(10)].map(() => ({
  id: casual.uuid,
  name: casual.company_name,
  industry: casual.catch_phrase,
  contactEmail: casual.email,
  __typename: "Company"
}))

const resolvers = {
  Query: {
    getEntities : () => [...contacts, ...companies],
    getEntity: (_, args) => [...contacts, ...companies].find(entity => entity.id === args.id)
  },
  Mutation: {
    createEntity: (input) => {},
    updateEntity: (input)=> {}
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);