# Todo

1. Support Blob
  1. Issue: Node fetch doesn't support `.blob`
  2. Solution: Figure out how to use streams and other APIs like File Reader before adding to zlFetch.
2. Support ArrayBuffer
  1. Issues:
    1. Not sure which content types require array buffer (Audio data only? Anything else?)
    2. Node fetch doesn't support `.arrayBuffer`.
  2. Solution:
    1. Might need to use streams instead calling `.arrayBuffer`
3. Support URLSearchParams
  1. Issues: Haven't explored
4. Support formData
  1. Issues: Haven't explored
