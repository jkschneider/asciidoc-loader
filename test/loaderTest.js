var should = require("should");
var loader = require("../");

it('requires includes and images', function() {
  var loaded = loader(
    "= My Doc\n" +
    "include::part1.adoc[leveloffset=+1]\n" +
    "include::part2.adoc[leveloffset=+1]\n" +
    "image::sunset.jpg[Sunset,300,200]\n" +
    "image::img/sunrise.jpg[]\n");

  loaded.should.containEql('require("!asciidoc-loader!./part1.adoc")');
  loaded.should.containEql('require("!asciidoc-loader!./part2.adoc")');
  loaded.should.containEql('require("!file-loader!./sunset.jpg")');
  loaded.should.containEql('require("!file-loader!./img/sunrise.jpg")');
});
