'use strict';

module.exports = function() {
    var Jade = require('jade');
    var Blade = Jade.Compiler.prototype;

    Blade.visitDirectives = function (tag) {
        if (tag.statements) {
            this.compileStatements(tag);
        } else {
            if (this.pp) this.prettyIndent(1, true);
            this.buffer(tag.val);
        }
    };


    /**
     * Compile Blade statements that start with "@".
     *
     * @param  {object} tag
     * @return {mixed}
     */
    Blade.compileStatements = function (tag) {
        var self = this;
        var bufferTag = function () {
            self.buffer(tag.name + tag.val);
        };

        if (tag.name === "@extends") {
            bufferTag();
        } else {
            if (this.pp) this.prettyIndent(1, true);
            bufferTag();
        }

        if (tag.block) {
            this.indents++;
            if (!tag.buffer) this.buf.push('{');
            this.visit(tag.block);
            if (!tag.buffer) this.buf.push('}');
            this.indents--;
        }
    };


    /**
     * Visit Code
     *
     * @param  {obj} code
     * @return {string}
     */
    // Blade.visitCode = function(code) {
    //     var val = code.val;

    //     if (code.buffer) {
    //         val = code.escape ? `{{ ${val} }}` : `{!! ${val} !!}`;
    //     } else {
    //         if (this.pp) this.prettyIndent(1, true);
    //         val = `{{{ ${ val } }}}`;
    //     }

    //     this.buffer(val);
    // };


    /**
     * Comment
     */
    Blade.visitComment = function(comment) {
        var val = comment.val.trim();
        if (this.pp) this.prettyIndent(1, true);

        if (comment.buffer) {
            val = `<!-- ${val} -->`;
        } else {
            val = `{{-- ${val} --}}`;
        }

        this.buffer(val);
    };


    /**
     * Block Comment
     */
    Blade.visitBlockComment = function(comment) {
        var self = this;
        var line = comment.block.nodes.length;

        if (this.pp) this.prettyIndent(1, true);

        var bufferComment = function (open, close) {
            self.indents++;
            self.buffer(open);
            if (self.pp) self.prettyIndent(1, line == 1);
            self.visit(comment.block);
            if (self.pp) self.prettyIndent(0, true);
            self.buffer(close);
            self.indents--;
        };

        if (comment.buffer) {
            bufferComment('<!--', '-->');
        }
        else {
            bufferComment('{{--', '--}}');
        }
    };
};