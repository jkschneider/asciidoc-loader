// Works similarly to html-loader to cause React to pack adoc includes into the distribution
// and replacing the include link with the packed file.

module.exports = function(content) {
  var params = (this.query || '').substring(1).split('&')
    .reduce(function(map, p) {
      var parts = p.split('=');
      map[parts[0]] = parts[1];
      return map;
    }, {}) || {};

  var contentAffectedByIncludeParameters = content;

  var lineoffset = eval(params['lineoffset'] || 0);
  if(lineoffset !== 0) {
    contentAffectedByIncludeParameters = content.replace(/^(=+)/g, function (_, offset) {
      return lineoffset > 0 ?
        offset + ''.padStart(lineoffset, '=') :
        offset.substring(-1 * offset);
    });
  }

  return "module.exports = " + JSON.stringify(contentAffectedByIncludeParameters)
    .split('\\n')
    .map(function(line) {
      return line.replace(/(image|include)::([^.]+).([^\[]+)\[(.*)\]/g,
        function (_, type, name, ext, importProps) {
          var loader = type === 'image' ? 'file-loader' : 'asciidoc-loader';
          var require = '" + require("!' + loader + '!./' + name + '.' + ext + '") + "';

          return type == 'image' ?
            'image::' + require + '[' + importProps + ']' :
            require;
        })
    })
    .join('\\n');
};
