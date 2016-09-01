var valid = window.jQuery;

// Jack Rugile's (jackrugile.com) Parallax Mountains sketch.js (modified)
var Mountain, MountainRange, dt, mountainRanges, sketch;

sketch = Sketch.create();

sketch.mouse.y = sketch.height;

mountainRanges = [];

Mountain = function(config) {
  return this.reset(config);
};

Mountain.prototype.reset = function(config) {
  this.layer = config.layer;

  this.x = config.x;
  this.y = config.y;

  this.width = config.width;
  this.height = config.height;

  return this.color = config.color;
};

MountainRange = function(config) {
  this.x = 0;
  this.mountains = [];
  this.layer = config.layer;

  this.width = {
    min: config.width.min,
    max: config.width.max
  };

  this.height = {
    min: config.height.min,
    max: config.height.max
  };

  this.speed = config.speed;
  this.color = config.color;
  this.populate();

  return this;
};

MountainRange.prototype.populate = function() {
  if (valid) {
    var newHeight, newWidth;

    var totalWidth = 0;
    var results = [];

    while (totalWidth <= sketch.width + (this.width.max * 4)) {
      newWidth = round(random(this.width.min, this.width.max));
      newHeight = round(random(this.height.min, this.height.max));

      this.mountains.push(new Mountain({
        layer: this.layer,
        x: this.mountains.length === 0 ? 0 : this.mountains[this.mountains.length - 1].x + this.mountains[this.mountains.length - 1].width,
        y: sketch.height - newHeight,
        width: newWidth,
        height: newHeight,
        color: this.color
      }));

      results.push(totalWidth += newWidth);
    }

    return results;
  }
};

MountainRange.prototype.update = function() {
  if (valid) {
    var firstMountain = this.mountains[0];

    if (firstMountain.width + firstMountain.x + this.x < -this.width.max) {
      var newWidth = round(random(this.width.min, this.width.max));
      var newHeight = round(random(this.height.min, this.height.max));
      var lastMountain = this.mountains[this.mountains.length - 1];

      firstMountain.reset({
        layer: this.layer,
        x: lastMountain.x + lastMountain.width,
        y: sketch.height - newHeight,
        width: newWidth,
        height: newHeight,
        color: this.color
      });

      return this.mountains.push(this.mountains.shift());
    }
  }
};

MountainRange.prototype.render = function() {
  if (valid) {
    var c, d, i, j, pointCount, ref;

    sketch.save();
    sketch.translate(this.x, (sketch.height - sketch.mouse.y) / 20 * this.layer);

    sketch.beginPath();

    pointCount = this.mountains.length;

    // Offset by 10 pixels to accomodate stroke width.
    var offset = 10;

    sketch.moveTo(this.mountains[0].x - offset, this.mountains[0].y);

    for (i = j = 0, ref = pointCount - 2; j <= ref; i = j += 1) {
      c = (this.mountains[i].x + this.mountains[i + 1].x) / 2;
      d = (this.mountains[i].y + this.mountains[i + 1].y) / 2;

      sketch.quadraticCurveTo(this.mountains[i].x, this.mountains[i].y, c, d);
    }

    sketch.lineTo(sketch.width - this.x, sketch.height + offset);
    sketch.lineTo(this.x - offset, sketch.height + offset);

    sketch.closePath();

    sketch.fillStyle = this.color;
    sketch.fill();

    sketch.strokeStyle = "white";
    sketch.lineWidth = 3;
    sketch.stroke();

    return sketch.restore();
  }
};

sketch.setup = function() {
  if (valid) {
    var i, results;
    i = 3;
    results = [];

    var mountainHue = 220;
    var mountainSat = 6;
    var colorString = 'hsl({h}, {s}%, {l}%)';

    while (i--) {
      results.push(mountainRanges.push(new MountainRange({
        layer: i + 1,
        width: {
          min: (i + 1) * 50,
          max: (i + 1) * 70
        },
        height: {
          min: 200 - (i * 40),
          max: 300 - (i * 40)
        },
        speed: (i + 1) * .003,
        color: colorString.supplant({
          h: mountainHue,
          s: mountainSat,
          l: 31 - (i * 7)
        })
      })));
    }

    return results;
  }
};

sketch.clear = function() {
  if (valid) {
    return sketch.clearRect(0, 0, sketch.width, sketch.height);
  }
};

sketch.update = function() {
  if (valid) {
    var i = mountainRanges.length;
    var results = [];

    while (i--) {
      results.push(mountainRanges[i].update(i));
    }

    return results;
  }
};

sketch.draw = function() {
  if (valid) {
    var i = mountainRanges.length;
    var results = [];

    while (i--) {
      results.push(mountainRanges[i].render(i));
    }

    return results;
  }
};

$(window).on('mousemove', function(e) {
  return sketch.mouse.y = e.pageY;
});


// Douglas Crockford's Remedial Javascript
String.prototype.supplant = function (o) {
  return this.replace(
    /\{([^{}]*)\}/g,
    function (a, b) {
      var r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
};
