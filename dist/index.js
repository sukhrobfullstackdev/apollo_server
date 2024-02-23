import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./_db.js";
const resolvers = {
    Query: {
        reviews: () => db.reviews,
        review: (_, args) => db.reviews.find(review => review.id === args.id),
        authors: () => db.authors,
        author: (_, args) => db.authors.find(author => author.id === args.id),
        games: () => db.games,
        game: (_, args) => db.games.find(game => game.id === args.id)
    },
    Game: {
        reviews: (parent) => db.reviews.filter(review => review.game_id === parent.id)
    },
    Author: {
        reviews: (parent) => db.reviews.filter(review => review.author_id === parent.id)
    },
    Review: {
        author: (parent) => db.authors.find(author => author.id === parent.author_id),
        game: (parent) => db.games.find(game => game.id === parent.game_id),
    },
    Mutation: {
        deleteGame: (_, args) => {
            db.games = db.games.filter(game => game.id != args.id);
            return db.games;
        },
        addGame: (_, args) => {
            const game = { ...args.game, id: Math.floor(Math.random() * 100000).toString() };
            db.games.push(game);
            return game;
        },
        updateGame: (_, args) => {
            return db.games.map((game) => {
                if (game.id === args.id)
                    return { ...game, ...args.game };
                return game;
            });
        }
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`Server ready at: ${url}`);
