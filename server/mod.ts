import { serve } from "../deps/std.ts";
import { serveFile } from "../deps/std.ts";

import {CompilerFileSource} from "../compiler/compiler.ts"
import {defaultFileOptions} from "../compiler/mod.ts"

const regex = /([A-z0-9\-]+\.\w+|(\/[A-z0-9\-]+))$/;

const legacyServer = async (config: CompilerFileSource) => {
  try {
    const fullOpts = {...defaultFileOptions, ...config};
    const server = serve({ port: 8080 });
    console.log("[Ω] Server up at http://localhost:8080");

    for await (const req of server) {
      const url = req.url.endsWith("/") ? `${req.url}index.html` : req.url;
      const matches = url.match(regex);

      let path = `${Deno.cwd()}/${fullOpts.baseDir ?? ""}/${fullOpts.dstDir}${url}`;
      if (matches?.[2] != null) {
        path = `${path}.html`;
      }
      // console.log(`GET ${url}`)

      try {
        const result = await Deno.stat(path);
        if (result.isFile) {
          const content = await serveFile(req, path);
          req.respond(content);
          continue;
        }
      } catch (e2) {
        // Ignore favicon misses
        if (!path.includes('favicon')) {
          console.trace('err', e2, path)
        }
        // do nothing
      } finally {
        // do nothing
      }
      req.respond({ status: 404 });
    }
  } catch (e1) {
    console.trace("something went wrong", e1);
  }
};

const server = async () => {
  // Start listening on port 8080 of localhost.
  const server = Deno.listen({ port: 8080 });
  console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

  // Connections to the server will be yielded up as an async iterable.
  for await (const conn of server) {
    // In order to not be blocking, we need to handle each connection individually
    // in its own async function.
    (async () => {
      // This "upgrades" a network connection into an HTTP connection.
      const httpConn = Deno.serveHttp(conn);
      // Each request sent over the HTTP connection will be yielded as an async
      // iterator from the HTTP connection.

      const callbacks = { onDone: () => {} };
      for await (const requestEvent of httpConn) {
        const req = requestEvent.request;

        const url = req.url.endsWith("/") ? `${req.url}index.html` : req.url;
        const path = `${Deno.cwd()}/site/public${url}`;
        // console.log(`GET ${url}`)

        try {
          const result = await Deno.stat(path);
          if (result.isFile) {
            // const content = await serveFile(path, callbacks)
            requestEvent.respondWith(new Response("body", { status: 200 }));
            // callbacks.onDone()
            continue;
          }
        } catch (e) {
          // console.log('err', e)
          // do nothing
        } finally {
          // do nothing
        }
        requestEvent.respondWith(new Response("body", { status: 200 }));

        // The native HTTP server uses the web standard `Request` and `Response`
        // objects.
        // const body = `Your user-agent is:\n\n${requestEvent.request.headers.get(
        //   "user-agent",
        // ) ?? "Unknown"}`;
        // The requestEvent's `.respondWith()` method is how we send the response
        // back to the client.
        requestEvent.respondWith(
          new Response("body", {
            status: 200,
          }),
        );
      }
    })();
  }
};

export default legacyServer;
