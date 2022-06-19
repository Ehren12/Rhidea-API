import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
const { prisma } = require('./prisma/client')
// 1
const startServer = async () => {

  // 2
  const app = express()
  const httpServer = createServer(app)

  // 3
  const typeDefs = gql`
    type Query {
    boards: [Board]
  }

  type Board {
    id: ID!
    title: String!
    description: String
    path: String!
  }
  `;

  // 4
  const resolvers = {
    Query: {
      boards: () => {
        return prisma.board.findMany()
      }
    },
  };

  // 5
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  })

  // 6
  await apolloServer.start()

  // 7
  apolloServer.applyMiddleware({
      app,
      path: '/api'
  })

  // 8
  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`)
  )
}

startServer()
