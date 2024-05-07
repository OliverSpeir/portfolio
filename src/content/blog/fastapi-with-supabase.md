---
title: "FastAPI with Supabase Auth"
description: "This blog explains how to create a FastAPI that uses Supabase Auth and allows for RLS"
ogImage: "../../assets/imgs/fastapi-supabase.png"
date: 2023-08-20T03:21:44Z
---


TLDR the trick is to send the access token that is received from the Supabase session on frontend as headers in the request to the FastAPI and then create middleware to validate that token with Supabase.

:::note
This solution was created for `1.0.3` of Supabase-py
:::
<p></p>

This blog details using `supabase-py` on a FastAPI layer in between frontend using Supabase Auth and Supabase itself.

## Solution

Create middleware that handles the authentication with Supabase. This will allow the FastAPI endpoints to make authenciated requests to Supabase using the Supabase client library without any extra work. The middleware can then add the `user_id` of the requestor into the state of the request so that each endpoint can access the `user_id`.

## Code

### Frontend

```typescript
import { supabase } from "./supabaseClient";

const session = await supabase.auth.getSession();
const tokens = session?.data?.session?.access_token;

const response = await fetch(apiUrl as RequestInfo, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${tokens}`,
	},
	body: JSON.stringify(body),
});
```

### FastAPI Supabase Client Setup

```py
from supabase import create_client, Client
from fastapi import FastAPI, Request

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
app = FastAPI()
```

### FastAPI Middleware

```py
@app.middleware("http")
async def add_authentication(request: Request, call_next):

    if request.method == "OPTIONS":
        return await call_next(request)

    token = request.headers.get("authorization", "").replace("Bearer ", "")

    if not token:
        return Response("Unauthorized", status_code=401)

    try:
        auth = supabase.auth.get_user(token)
        request.state.user_id = auth.user.id
        supabase.postgrest.auth(token)

    except Exception:
        return Response("Invalid user token", status_code=401)

    return await call_next(request)
```

In the endpoint functions the user_id can be accessed like this: <br />
FastAPI: <br />
`user_id = request.state.user_id` <br />
Strawberry GraphQL on FastAPI: <br />
`user_id = info.context["request"].state.user_id`

## Example RLS policy

- Operation: `INSERT`
- Target Roles: `authenticated`
- WITH CHECK Expression: `(auth.uid() = user_id)`

If this is the only policy applied to the table for `INSERT` only authenticated users will be able to create entries, and those entries' `user_id` column will need to match their own user_id that is stored automatically in the Auth Users table by supabase when they login.

## Resources

- My project using this solution: [Frontend](https://github.com/OliverSpeir/business-card-frontend) [Backend](https://github.com/OliverSpeir/business-card-fastapi)
- [Supabase Python Client Library](https://github.com/supabase-community/supabase-py)
- [Supabase Python Client Library Docs](https://supabase.com/docs/reference/python/initializing)
- [FastAPI Middleware Docs](https://fastapi.tiangolo.com/tutorial/middleware/)
