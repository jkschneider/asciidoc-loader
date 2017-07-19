var should = require("should");
var loader = require("../");

it('requires includes and images', function() {
  var loaded = loader(
    "= My Doc\n" +
    "include::part1.adoc[leveloffset=+1]\n" +
    "include::part2.adoc[indent=+1]\n" +
    "image::sunset.jpg[Sunset,300,200]\n" +
    "image::img/sunrise.jpg[]\n");

  loaded.should.containEql('require("!asciidoc-loader?leveloffset=+1!./part1.adoc")');
  loaded.should.containEql('require("!asciidoc-loader!./part2.adoc")');
  loaded.should.containEql('require("!file-loader!./sunset.jpg")');
  loaded.should.containEql('require("!file-loader!./img/sunrise.jpg")');
});

it('supports positive line offset', function() {
  var loaded = loader.bind({query: '?lineoffset=+1'})('= My Doc');
  loaded.should.containEql('== My Doc');
});

it('supports negative line offset', function() {
  var loaded = loader.bind({query: '?leveloffset=-1'})('== My Doc');
  loaded.should.containEql('= My Doc');
});
