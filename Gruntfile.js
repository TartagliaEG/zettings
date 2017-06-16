module.exports = function(grunt) {

  function copyFilter(src) {
    return !src.match(/(.ts)$/i);
  }

  grunt.initConfig({
    copy: {
      options: {
        forceOverwrite: true,
        force: true
      },
      src:  { expand: true, cwd: "src",  src: "**", filter: copyFilter, dest: '.dist/src'  },
      test: { expand: true, cwd: "test", src: "**", filter: copyFilter, dest: '.dist/test' }
    },

    ts: {  // https://github.com/TypeStrong/grunt-ts
      options: {
        target: 'es6',
        module: 'commonjs',
        sourceMaps: true,
        outFile: '.dist/src/zettings.js',
        declaration: true,
        removeComments: false,
        noImplicitAny: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        noImplicitThis: true,
        alwaysStrict: true
      },
      fullCompile:  { src: ['./{src,test}/**/*.ts'], outDir: '.dist/', options: { fast: 'never'  } },

    }
  });

  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-contrib-copy");

  grunt.registerTask("build", ["ts:fullCompile", "copy:src", "copy:test"]);

};