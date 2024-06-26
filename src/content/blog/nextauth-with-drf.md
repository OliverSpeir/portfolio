---
title: "NextAuth with Django REST Framework"
description: "This blog post explains how to create a NextAuth SocialSignOn button that connects to a Django REST Framework API"
ogImage: "../../assets/imgs/drf-nextauth.png"
date: 2023-04-03T03:21:44Z
---

This blog will outline and explain the steps for accomplishing:

- SSO for NextJS frontend using NextAuth
- Authenticated and Authorized endpoints in DRF using Token Authentication

TLDR: The trick is to use the SignIn callback to send the `idToken` from SSO provider to the DRF backend, and have the DRF backend validate the token then create a token (or new account and token) that can be used to authenticate future requests to the DRF endpoints.

## Request Response Cycle

1. Frontend will send a reques to NextAuth Login API.
2. NextAuth Login API will request a token from the SSO Server. This is the first step in Authentication.
3. NextAuth API will send that token to DRF Server.
4. DRF Server will validate that token with SSO Server. This is the second step in Authentication, basically verification of authentication.
5. DRF Server will either create a new account and token for that user or regenerate the token of that user and send it back to NextAuth API - any other information from the user can also be sent back and included in the resulting login session at this time.
6. NextAuth will create a session which persists in the clients browser via a cookie (which cannot be accessed by javascript running in browser).
7. useSession hook will be availble throughout the NextJS project to allow access to session information. This session will contain the Authentication Token which will be used to Authenticate the user when they make requests to the backend.

![NextAuth SSO Provider DRF image](../../assets/imgs/NA-DRF-RRC.png)

## SSO Set up

In this example Google OAuth2 will be used, but any service that provides social sign on will work the same.

First acquire a client ID and secret from the provider, then configure the allowed origins and callback URLs with the SSO provider.

[NextAuth Callback URL Docs](https://next-auth.js.org/configuration/callbacks#redirect-callback)

## NextAuth

Our NextJS project needs to create a NextAuth API which is as simple as creating a `pages/api/auth/[...nextauth].js` file with the following source code:

### NextAuth code

```javascript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT,
			clientSecret: process.env.NEXT_PUBLIC_OAUTH_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		maxAge: 24 * 60 * 60,
	},
	callbacks: {
		async signIn({ user, account }) {
			if (user) {
				const idToken = account.id_token;
				try {
					await fetch(`${process.env.NEXT_PUBLIC_LOGIN_URL}`, {
						method: "post",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							auth_token: idToken,
						}),
					})
						.then((response) => response.json())
						.then((data) => (user.auth_token = data));
					return true;
				} catch (error) {
					return false;
				}
			}
		},
		async jwt({ token, user }) {
			if (user) {
				const { auth_token } = user;
				token.auth_token = auth_token;
			}
			return token;
		},

		async session({ session, token }) {
			if (token.auth_token) {
				session.auth_token = token.auth_token;
				return session;
			}
		},
	},
});
```

### NextAuth code explained

NextAuth has builtin providers for all SSO providers, here we are using the GoogleProvider.

This code starts off by setting the secret from an environmental variable, then the session settings are configured.

`maxAge` determines how long the session will be valid, which means how long until the user will need to sign in again.

#### Callback functions

The `signIn` callback is invoked when the user is authenticated by the SSO provider.

In this configuration the `signIn` callback will make a POST request to the DRF server. The body of the POST request will be our `idToken` (which is received from the SSO provider).

The `jwt` callback is invoked when the the signIn callback returns true.

This is where we can define what information will be stored in the JWT, which is stored in the Session Cookie. In this configuration we include the `auth_token` that is sent by the DRF Server which will later be used as an API key to make authenticated requests to the DRF server.

The `session` callback is invoked after the jwt callback signs and encrypts the jwt

This is when `auth_token` gets added into the session object. After the session callback completes the session is created and the user is returned to the frontend.

### Making calls to the protected DRF endpoints

```js
import { useSession } from "next-auth/react";
const { data: session } = useSession();
```

These two lines of code give the frontend access to the `auth_token` that we need to use to communicate with the DRF server.

Any other data that you have added into the session (e.g. data from the `idToken` or sent from the DRF server) can also be accessed like this.

When making requests to the protected DRF endpoints use this header:

```javascript
headers: {
  Authorization: "Token " + auth_token,
  "Content-Type": "application/json",
}
```

## DRF

Our endpoints will be protected by [Token Authorization](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication). The step up consists of adjusting the user model and creating 4 new files.

### DRF Code

1. The accounts model should have an Auth Provider attribute in case multiple providers are used

- `auth_provider = models.CharField(max_length=50)`

2. `views.py` should have a SocialAuthView that does not require authorization

```python
@permission_classes((AllowAny, ))
class GoogleSocialAuthView(GenericAPIView):

    serializer_class = GoogleSocialAuthSerializer

    def post(self, request):
        """
        POST with "auth_token"
        Send an idtoken as from google to get user information
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = ((serializer.validated_data)['auth_token'])
        return Response(data, status=status.HTTP_200_OK)
```

3. `serializers.py` should have a SocialAuthSerializer that is used to validate the `idToken` that the NextAuth API sends

```python
class GoogleSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        user_data = google.Google.validate(auth_token)
        try:
            user_data['sub']
        except:
            raise serializers.ValidationError(
                'The token is invalid or expired. Please login again.'
            )
        if user_data['aud'] != settings.GOOGLE_CLIENT_ID:

            raise AuthenticationFailed('oops, who are you?')

        email = user_data['email']
        name = user_data['name']
        provider = 'google'

        return register_social_user(
            provider=provider, email=email, name=name)
```

4. This serializer will take import from the next file we need to create `google.py`

```python
from google.auth.transport import requests
from google.oauth2 import id_token

class Google:

    @staticmethod
    def validate(auth_token):
        try:
            idinfo = id_token.verify_oauth2_token(
                auth_token, requests.Request())

            if 'accounts.google.com' in idinfo['iss']:
                return idinfo

        except:
            return "The token is either invalid or has expired"
```

5. Next we need to create `register.py`

```python
from rest_framework.authtoken.models import Token
from default_locations.models import DefaultLocation
from accounts.models import User
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from django.core.exceptions import ObjectDoesNotExist


def register_social_user(provider, email, name):
    filtered_user_by_email = User.objects.filter(username=email)
    if filtered_user_by_email.exists():
        if provider == filtered_user_by_email[0].auth_provider:
            registered_user = User.objects.get(username=email)
            registered_user.check_password(settings.SOCIAL_SECRET)
            Token.objects.filter(user=registered_user).delete()
            Token.objects.create(user=registered_user)
            new_token = list(Token.objects.filter(
                user_id=registered_user).values("key"))
            return {
                'user_id': registered_user.id,
                'tokens': str(new_token[0]['key'])}
        else:
            raise AuthenticationFailed(
                detail='Login using ' + filtered_user_by_email[0].auth_provider)
    else:
        user = {
            'username': email,
            'password': settings.SOCIAL_SECRET
        }
        user = User.objects.create_user(**user)
        user.is_active = True
        user.auth_provider = provider
        user.save()
        new_user = User.objects.get(username=email)
        new_user.check_password(settings.SOCIAL_SECRET)
        Token.objects.create(user=new_user)
        new_token = list(Token.objects.filter(user_id=new_user).values("key"))
        return {
            'user_id': new_user.id,
            'tokens': str(new_token[0]['key']),
        }
```

### DRF Code Explained

1. The user model needs to keep track of the auth_provider so that multiple SSO providers can be implemented

   - This allows for Sign in with Google, Sign in with Facebook, Sign in with Github, etc...

2. Creating a view for each SSO creates an endpoint that NextAuth will request during the `signIn` callback
3. Creating a serializer for each endpoint allows for the `idToken` sent by that endpoint to be validated

   - This is where one would make a query for other data in the DRF's database that they might send back to be included in the frontend's session data

4. Creating `google.py` as a seperate file is not strictly necessary but this allows for more readable code in my opinion

   - this function is what actually contacts the SSO provider and validates the token

5. `register.py` is where the users and tokens are generated

   - if the user already exists their existing token is deleted and a new one is created for them
   - if the user does not exist a token and a new user is created

The DRF server needs to expose an unauthorized endpoint that accepts an `idToken`, validate that token with the provider and if the token is valid it needs to create an Authorization Token, and a new user if that `idToken` has not already been used by an existing account.

### Requiring Authorization for other DRF endpoints

1. Add `permission_classes = (IsAuthenticated,)` with the `rest_framework.permissions import IsAuthenticated` function to all endpoints

   - it is possible to set permission classes with decorators as well
   - `@permission_classes( [IsAuthenticated], )`
   - [DRF permissions docs](https://www.django-rest-framework.org/api-guide/permissions/)

2. Place these settings in the `settings.py` file of the main portion of the Django project

```python
AUTH_USER_MODEL = "accounts.User"
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}
```

3. This is all that is required for the endpoints to refuse access when in invalid token is not sent to them and accept when a valid token is sent
4. The endpoints will now have `self.request.user` availble to them

## Resources

- [Project I used this code for](https://github.com/orgs/Oxygen-Oriented-Programming/repositories)
  - [NextAuth file of the project](https://github.com/Oxygen-Oriented-Programming/Clean-Air-Compass-Frontend-NextJS/blob/dev/pages/api/auth/%5B...nextauth%5D.js)
  - [DRF Accounts app of the project](https://github.com/Oxygen-Oriented-Programming/Clean-Air-Compass-Accounts-DjangoRestFramework/tree/dev/accounts)
- [Token Authentication](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication)
- [NextAuth Docs](https://next-auth.js.org/configuration/initialization)
- [GitHub Discussion about NextAuth and DRF](https://github.com/nextauthjs/next-auth/discussions/1350)
- [Article by Mahieyin Rahmun](https://mahieyin-rahmun.medium.com/how-to-configure-social-authentication-in-a-next-js-next-auth-django-rest-framework-application-cb4c82be137) and its [second part](https://mahieyin-rahmun.medium.com/how-to-configure-social-authentication-in-a-next-js-next-auth-django-rest-framework-application-cb4c82be137)
- [Article by Episyche](https://episyche.com/blog/how-to-configure-google-sso-in-django-rest-framework-with-nextjs) used for `register.py`, `google.py` and `serializers.py`
