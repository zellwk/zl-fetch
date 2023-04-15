# Improvements

- Support ability to abort fetch calls with Abort controller
- createZlFetch should be able to create a default URL so we don't have to call that url again

# Add to readme and changelog

- Changelog

  - Setting Content-Type headers is no longer required. We will now automatically set the Content-Type header based on the body type.
  - If you set Content-Type, you're expected to send in the correct body content yourself.

- Working with FormData
  - You can send it. But make sure your server is able to receive it. Since FormData is multipart/form-data with boundaries. Show example in Express or something.
  - Get Form Data and send it => Use a to toObject transformer because zlFetch automatically converts object to JSON.
