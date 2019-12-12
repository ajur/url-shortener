# URL shortener

Web application that takes a URL as an input and generates a “short-url” for it (similar to bitly.com). Output URL should be short, readable and able to be easily copy-pasted by users.

Constraints:

- URL parameters should be considered part of the URL uniqueness test.
- A generated short URL should expire if not accessed for 14 or more days
- Persist data in data store
- Handle error cases


## spec

### web page

Minimalistic, single page, responsive application, with one input for entering url, and submit button labeled *Shorten*.

Shortening done asynchronously. Input blocked until got response.

Successfully shortened URL replaces shortened url, possibly auto-selected. *Shorten* button changes to *Copy* button, allowing coping shortened URL to user's clipboard.

Errors are displayed as stylized text under input.

Any input modification changes *Copy* button back to *Shorten* and removes all error messages.

### shortening

Original URL is validated for syntax, but it's not verified for existing endpoint.

Shortened URL is short (lets assume 5 characters), unique and readable. URL query parameters are considered in uniqueness test.

Passing already shortened URL results with an error.

Q: Should shortening same URL twice (within 14 days) return same shortened URL?

Q: Could you specify "readable"? Is it "random set of only letters and numbers" or maybe rather "random words", possibly also with numbers?

### redirecting

Shortened URL can be accessed withing 14 days from last access.

Request to shortened URL should redirect browser to location addressed with original URL.

Request to non existing URL return *page not found* error.

## architecture

### SPA

- Single static HTML page
- Vanilla JS
- Minimalistic CSS
- JS and CSS inlined?

Q: Can I assume targeting modern browsers and not include babel?

### server

- Newest Node.js with Express

Routes:

`GET /` serve index.html

- uses ajax/fetch for async submit

`POST /` shorten url

- validate URL
- store new url in DB
- send `200` on success, with response json `{url: "original", short: "shortened"}`
- send `400` on validation failed

`GET /:id` attempt redirecting

- get url from DB, if exists
- send `301` with target location and simply html body when found
- send `404` when url not found

### db

Simple key-value store with shortened `id` as key, and original URL as value.

Every value has 14 day expire time.

Each access resets expiration time back to 14 days.

Expired entries should be removed permanently.
