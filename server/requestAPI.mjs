import https from "https";
import fetch from "node-fetch";

// Set the global agent for HTTPS to disable SSL verification

https.globalAgent.options.rejectUnauthorized = false;

export const requestAPI = async ({ url, options }) => {
  const response = await fetch(url, options);
  const parsedResponse = await response.json();
  return parsedResponse;
};
