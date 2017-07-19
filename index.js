// Works similarly to html-loader to cause React to pack adoc includes into the distribution
// and replacing the include link with the packed file.

module.exports = function(content) {
  return "module.exports = " + JSON.stringify(content)
    .split('\\n')
    .map(function(line) {
      return line.replace(/(image|include)::([^.]+).([^\[]+)\[(.*)\]/g,
        function (_, type, name, ext, importProps) {
          var loader = type === 'image' ? 'file-loader' : 'asciidoc-loader';
          return type + '::' + '" + require("!' + loader + '!./' + name + '.' + ext + '") + "[' +
            importProps + ']';
        })
    })
    .join('\\n');
};
