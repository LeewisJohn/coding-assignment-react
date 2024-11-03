import { api } from '../api';
import type { User } from '../apiTypes';

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    users: builder.query<User[], void>({
      query: () => ({
        url: `users`,
      }),
      providesTags: ['Users'],
    }),
  }),
  overrideExisting: false,
});

export const { useUsersQuery } = extendedApi;

// selectors
export const selectUsers = () =>
  extendedApi.useUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({ users: data }),
  });
