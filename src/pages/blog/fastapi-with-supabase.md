---
layout: ../../layouts/Blog.astro
title: "FastAPI with Supabase"
description: "This blog explains how to create a FastAPI that uses Supabase Auth and allows for RLS"
cardPicture: "/fastapi-with-supabase-logo.png"
---

# FastAPI with Supabase Auth

This blog will explain how to create a FastAPI backend for a frontend application that uses Supabase Auth.

For a TLDR the trick is to send the access token that is received from the Supabase session on frontend as headers in the request to the FastAPI and then create middleware to validate that token with Supabase.

Disclaimer: `supabase-py` is community maintained and currently in public alpha so the syntax is subject to change. This solution works as of 6/7/23.

# Contents

- [Explanation](#explanation)
- [Code](#code)
- [Resources](#resources)

# Explanation

Supabase Auth is very easy to set up on frontend, and allows for using Supabase like a backend-as-a-service quite easily. Supabase also offers Row Level Security feature for the Postgres DB they provide, which is very useful for adding another layer of security. This blog solves the issue of creating your own backend that can interface with Supabase. We will also ensure that RLS can be activated on Supabase to provide insurance if code that might leak data makes its way into the backend.

## Why would you want to create your own backend if you could use Supabase directly?

This allows you to switch to a different DB provider, or use your own postgres container. It allows for backend logic, for example GraphQL resolvers could fetch data from sources other than the DB. There are many reasons why you wouldn't want to commit your product design to using Supabase as a backend.

## The problem this blog solves

The supabase python client library is quite useful as a wrapper for the REST APIs Supabase provides. However the documentation does not make it obvious how to authenticate a user from a backend, as it assumes the users will be logging in with the library.

## How to solve this problem

Create middleware that handles the authentication with Supabase. This will allow the FastAPI endpoints to make authenciated requests to Supabase using the Supabase client library without any extra work. The middleware can then add the user_id of the requestor into the state of the request so that each endpoint can access the user_id.

# Code

## Frontend

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

## FastAPI Supabase Client Setup

```python
    from supabase import create_client, Client
    from fastapi import FastAPI, Request
    
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    app = FastAPI()
```

## FastAPI Middleware

```python
@app.middleware("http")
async def add_authentication(request: Request, call_next):

    if request.method == "OPTIONS":
        return await call_next(request)

    token = request.headers.get("authorization", "").replace("Bearer ", "")

    if not token:
        return Response("Unauthorized", status_code=401)

    try:
        auth = supabase.auth.get_user(token) # will raise exception if invalid
        request.state.user_id = auth.user.id # makes user id available to all end points
        supabase.postgrest.auth(token) # "logs" the client library on the backend
    
    except Exception:
        return Response("Invalid user token", status_code=401)

    return await call_next(request)
```

In the endpoint functions the user_id can be accessed like this: <br />
FastAPI: <br />
`user_id = request.state.user_id`
Strawberry GraphQL on FastAPI: <br />
`user_id = info.context["request"].state.user_id`

## Example RLS policy

- Operation: `INSERT`
- Target Roles: `authenticated`
- WITH CHECK Expression: `(auth.uid() = user_id)`

If this is the only policy applied to the table for `INSERT` only authenticated users will be able to create entries, and those entries' `user_id` column will need to match their own user_id that is stored automatically in the Auth Users table by supabase when they login.

# Resources

- My project using this solution: [Frontend](https://github.com/OliverSpeir/business-card-frontend) [Backend](https://github.com/OliverSpeir/business-card-fastapi)
- [Supabase Python Client Library](https://github.com/supabase-community/supabase-py)
- [Supabase Python Client Library Docs](https://supabase.com/docs/reference/python/initializing)
- [FastAPI Middleware Docs](https://fastapi.tiangolo.com/tutorial/middleware/)
