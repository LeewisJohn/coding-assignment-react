import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';
import { httpErrorHandler } from '../helper/httpErrorHandler';
import { debounce } from '../helper/utils';

// Create a debounced version of the httpErrorHandler
const debouncedHttpErrorHandler = debounce((error) => {
  httpErrorHandler({ err: error });
}, 500);

// can setup another BaseQuery if u want axios, graphQL ..
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:4200/api/',
  credentials: 'include',
});

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,          // request type
  unknown,                     // result type
  FetchBaseQueryError,         // error type
  {},                          // arg option type (thường là một object rỗng nếu không có thêm options)
  FetchBaseQueryMeta           // metadata type (metadata returned by query)
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error) {
    // httpErrorHandler({ err: result.error });
    debouncedHttpErrorHandler({ err: result.error });
  }
  return result;
};

export const api = createApi({
  reducerPath: 'ticketApiReducer',
  baseQuery: baseQueryWithErrorHandling, // Sử dụng baseQuery đã cấu hình với xử lý lỗi
  tagTypes: ['Ticket1', 'Ticket', 'Users'],
  endpoints: (builder) => ({}),
});
