import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { postss } from "~/server/db/schema";
import { eq, gte } from "drizzle-orm/expressions";

export const postRouter = createTRPCRouter({
  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.postss.findMany();
  }),

  createUser: publicProcedure
    .input(
      z.object({
        firstname: z.string(),
        lastname: z.string(),
        address: z.string(),
        age: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(postss).values({
        firstname: input.firstname,
        lastname: input.lastname,
        address: input.address,
        age: input.age,
      });
    }),

  // New deleteUser procedure
  deleteUser: publicProcedure
    .input(
      z.object({
        id: z.number(), // Assuming 'id' is the unique identifier for the user
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(postss).where(eq(postss.id, input.id)); // Delete record with matching ID
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        id: z.number(), // Ensure ID is a number
        firstname: z.string(), // These fields can be updated
        lastname: z.string(),
        address: z.string(),
        age: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(postss)
        .set({
          firstname: input.firstname,
          lastname: input.lastname,
          address: input.address,
          age: input.age,
        })
        .where(eq(postss.id, input.id));
    }),
});
