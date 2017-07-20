var loaderUtils = require('loader-utils');

// Works similarly to html-loader to cause React to pack adoc includes into the distribution
// and replacing the include link with the packed file.

module.exports = function(content) {
  var params = loaderUtils.getOptions(this) || {};
  var contentAffectedByIncludeParameters = content;

  var leveloffset = eval(params['leveloffset'] || 0);
  if (leveloffset !== 0) {
    contentAffectedByIncludeParameters = content.split('\n').map(function (line) {
      return line.replace(/^(=+)/g, function (_, offset) {
        return leveloffset > 0 ?
          offset + ''.padStart(leveloffset, '=') :
          offset.substring(-1 * offset);
      });
    }).join('\n');
  }

  return 'module.exports = ' + JSON.stringify(contentAffectedByIncludeParameters)
    .split('\\n')
    .map(function (line) {
      return line.replace(/(image|include)::([^.]+).([^\[]+)\[(.*)\]/g,
        function (_, type, name, ext, importProps) {
          var loader = type === 'image' ? 'file-loader' : 'asciidoc-loader';

          // combine the level offset coming to us from the parent adoc with the level offset specified on this include (if any)
          var childLeveloffset = leveloffset + eval(loaderUtils.parseQuery('?' + importProps.replace(/,/g, '&'))['leveloffset'] || 0);
          var query = type === 'include' ?
            (childLeveloffset === 0 ? '' : '?leveloffset=' + (childLeveloffset > 0 ? '+' + childLeveloffset : childLeveloffset)) :
            '';

          var require = '" + require("!' + loader + query + '!./' + name + '.' + ext + '") + "';

          return type === 'image' ?
            'image::' + require + '[' + importProps + ']' :
            require;
        });
    })
    .join('\\n');
};
