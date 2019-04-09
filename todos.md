# Todo

1. Automated frontend testing with Cypress(?).
  1. Test for:
    1. Preflight test with Dota API. Make sure it passes.
    2. Fetching with Github. Make sure it passes.
    3. Test `clone` with Chrome and Safari (for support and no support case)
2. Backend test with Node-fetch
  1. Sswitch to using `node-fetch` because `isomorphic-fetch` doesn't support `clone`. Only node-fetch > v1.4 supports clone.
3. Support Blob
  1. Issue: Node fetch doesn't support `.blob`
  2. Solution: Figure out how to use streams and other APIs like File Reader before adding to zlFetch.
4. Support ArrayBuffer
  1. Issues:
    1. Not sure which content types require array buffer (Audio data only? Anything else?)
    2. Node fetch doesn't support `.arrayBuffer`.
  2. Solution:
    1. Might need to use streams instead calling `.arrayBuffer`
5. Support URLSearchParams
6. Support formData
7. Support ability to abort fetch calls with Abort controller
