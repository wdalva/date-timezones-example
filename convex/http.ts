import { httpRouter } from "convex/server";
import { processDates } from "./dates.services";

const http = httpRouter();

http.route({
  path: "/processDates",
  method: "POST",
  handler: processDates,
});

export default http;
