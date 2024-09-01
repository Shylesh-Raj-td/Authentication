# Authentication and Authorization

There are two types of authentication

- [State](Session with cookie)
  --[session](#sessions)
  --[cookies](#Cookies)
- Stateless (token, OAuth, JWT)
  --[tokens](#tokens)

## Sessions

- User submits the login credentials, e.g., email and password
- Server verifies the credentials against the DB
- Server creates a temporary user Session
- Server send a SetCookie as a header and stores the sessionID in the cookie
- user sends the cookie with each request
- Server validates it aganist the session table and grants the access.
- When the user logs out, server destroys the session and clears the cookie.

- Every user session is stored server side(Stateful)
- Each user is identified by a sessionID

## Cookies

- Cookie header, just like Authorization or Content type,
- Used in Session management, personalization, tracking
- consists of name, value and attributes/ flags
- Set with Set-Cookie by server appended with Cookie by browser
- (HTTP/1.1 200 OK
  Content-type: text/html
  Set-Cookie: SESS_ID=9dchbsakdvfbsakjvbljsfbvljsfbv; Domain=example.com;
  Path=/)

  ## Attribures

  - **Domain** and **Path** (can only be used on a given site and route)
  - **Expiration** (can only be used until expiry)
    - when omitted, becomes a session cookie
    - gets deleted when browser is closed

  ## Flags

  - **HttpOnly** (Cannot be read with JS on the client-side)
  - **Secure** (Can only be sent over encrypted HTTPS channel)
  - **SameSite** (Can only be sent from the same Domain, i.e., no CORS sharing)

  ## CSRF(Cross Site request forgery)

  - unauthorised actions on behalf of the authenticated user
  - mitigated with a CSRF token(e.g., sent in a seperate X-CSRF-TOKEN cookie)

## Tokens

- Tokens are not stored server-side, only on the client(stateless)
- signed with a secret against tampering
  - Verified and can be trusted by the server
- tokens can be opaque or self-contained
  - carries all required user data in its payload
  - reduces database lookups, but exposes data to XSS
- typically sent in **Authorization** header
- when a token is about to expire, it can be refreshed
  - client is issued both access and refresh tokens
- Used in SPA web apps, web APIs and mobile apps

## Client Storage

- Tokens such as JWT can be stored in Client storage which are localStorage or sessionStorage

  - localStorage has no expiration time
  - sessionStorage gets cleared when page is closed

  # localStorage

  - Browser key-value store with a simple JS API
  - domain specific, each site has its own, o0ther sites can't read/write
  - max size higher than cookie( 5MB /domain vs 4KB /cookie)
  - plain text, hence not secure by design
  - limited to string data, hence need to serialize
  - stored permanently, unless removed explicitly
  - accessible to any JS code runnning on the page(inlc XSS)
    -it's best for public, non sensitive string data, not good for private or sensitive data
