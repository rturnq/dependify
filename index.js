var through = require('through2'),
    format = require('string-format-js');

var prefix = "(function(g, f) { var r = (typeof require === 'function' ? require : function(name) { return #{depsMap}[name]; }); if (typeof exports === 'object' && typeof module !== 'undefined') { module.exports = f(r) } else if (typeof define === 'function' && define.amd) { define(#{depsKeys}, f.bind(g,r)) } else { g.#{globalName} = f(r) } })(this, function(require,define, module,exports) { return ";

var suffix = "(#{moduleKey}); });";

function createStream(prefix, suffix) {
    var first = true;

    return through(function (chunk, encoding, next) {
        if (first) {
            this.push(new Buffer(prefix()));
            first = false;
        }
        this.push(chunk);
        next();
    }, function (next) {
        this.push(new Buffer(suffix()));
        next();
    });
}

module.exports = function (b, opts) {
    if (!opts) {
        throw new Error('Please provide some options to the plugin');
    } else if (typeof opts.name !== 'string') {
        throw new Error('Please specifiy a name for the module');
    }

    var deps = opts.deps || {},
        keys = Object.keys(deps);

    function applyPlugin() {
        return b.external(keys)
            .pipeline.get('wrap')
            .push(createStream(function () {
                return prefix.format({
                    globalName: opts.name,
                    depsKeys: JSON.stringify(keys),
                    depsMap: '{' + keys.map(function (key) {
                            return JSON.stringify(key) + ":" + deps[key];
                        }).join(',') + '}'
                });
            }, function () {
                return suffix.format({
                    // This is pretty hacky but Browserify has the standalone mode internalized
                    moduleKey: b._bpack.standaloneModule
                });
            }));
    }

    b.on('reset', applyPlugin);

    return applyPlugin();
};
