export const quearyUrlGenerator = (payloadUrl, queryParams) => {
  if (!queryParams) return payloadUrl;
  const encodedParams = Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .join("&");
  return encodedParams ? `${payloadUrl}?${encodedParams}` : payloadUrl;
};

export const pathUrlGenerator = (payloadUrl, queryParams) => {
  if (!queryParams) return payloadUrl;
  const { pathParams, ...queryParamsRest } = queryParams;
  let url = `${payloadUrl}${pathParams ? `/${pathParams}` : ""}`;
  const queryString = new URLSearchParams(queryParamsRest).toString();
  return queryString ? `${url}?${queryString}` : url;
};
