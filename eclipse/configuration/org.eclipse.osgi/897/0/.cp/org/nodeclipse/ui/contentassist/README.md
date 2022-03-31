
# Notes

Initial completion was procession completions.json file every time.  
Then one more type from all.json (from Node.js sources) was added `ContentFromSources`,
 that was precompiled into sorted TreeSet inside Model class.
As one more type from Orion IndexFiles was added `ContentFromOrionIndexFiles`, it is clear that all types should be precompiled,
 and Model should be passed as parameter.

## Eclipse API 

org.eclipse.jface.text.contentassist.IContentAssistProcessor


A content assist processor proposes completions and computes context information for a particular content type. A content assist processor is a org.eclipse.jface.text.contentassist.IContentAssistant plug-in. 

This interface must be implemented by clients. Implementers should be registered with a content assistant in order to get involved in the assisting process. 

      "classes": [
        {
          "textRaw": "Class: Domain",
          "type": "class",
          "name": "Domain",

          "textRaw": "Class: Domain","type": "class","name": "Domain"
          
          "textRaw": "http.createServer([requestListener])","type": "method","name": "createServer",
          

# all.json

in Node.js sources folder `doc/api/all.json`

search in all.json using '\n  "' regexp option to get it structure overview


{
  "source": "doc/api/all.markdown",
  "miscs": [
  "globals": [
  "vars": [
  "methods": [
  "modules": [
    {							// at 1794
      "textRaw": "util",
      "name": "util",
      "stability": 4,
      "stabilityText": "API Frozen",
      "desc": "<p>These functions are in the module <code>&#39;util&#39;</code>. Use <code>require(&#39;util&#39;)</code> to access\nthem.\n\n\n</p>\n",
      "methods": [
        {
          "textRaw": "util.format(format, [...])",
          "type": "method",
          "name": "format",
          "desc": "<p>Returns a formatted string ...
    {							// 2032
      "textRaw": "Events",
      "name": "Events",
      "stability": 4,
      "stabilityText": "API Frozen",
      "type": "module",
      "desc": "<p>Many objects in Node emit events: a <code>net.Server</code> emits an event each time\na peer connects to it, a <code>fs.readStream</code> emits an event when the file is\nopened. All objects which emit events are instances of <code>events.EventEmitter</code>.\nYou can access this module by doing: <code>require(&quot;events&quot;);</code>\n\n</p>\n<p>Typically, event names are represented by a camel-cased string, however,\nthere aren&#39;t any strict restrictions on that, as any string will be accepted.\n\n</p>\n<p>Functions can then be attached to objects, to be executed when an event\nis emitted. These functions are called <em>listeners</em>. Inside a listener\nfunction, <code>this</code> refers to the <code>EventEmitter</code> that the listener was\nattached to.\n\n\n</p>\n",
      "classes": [
        {
          "textRaw": "Class: events.EventEmitter",
          "type": "class",
          "name": "events.EventEmitter",
          "desc": "<p>To access the EventEmitter class, <code>require(&#39;events&#39;).EventEmitter</code>.\n\n</p>\n<p>When an <code>EventEmitter</code> instance experiences an error, the typical action is\nto emit an <code>&#39;error&#39;</code> event.  Error events are treated as a special case in node.\nIf there is no listener for it, then the default action is to print a stack\ntrace and exit the program.\n\n</p>\n<p>All EventEmitters emit the event <code>&#39;newListener&#39;</code> when new listeners are\nadded and <code>&#39;removeListener&#39;</code> when a listener is removed.\n\n</p>\n",
          "methods": [
            {
    {							// 9976
      "textRaw": "HTTP",
      "name": "http",
      "stability": 3,
      "stabilityText": "Stable",
          