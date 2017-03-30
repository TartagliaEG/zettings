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
        sourceMaps: true        
      },      
      fastCompile:  { src: ['./{src,test}/**/*.ts'], outDir: '.dist/', options: { fast: 'always' } },
      fullCompile:  { src: ['./{src,test}/**/*.ts'], outDir: '.dist/', options: { fast: 'never'  } },
      
    },
    watch: {
      copy: {
        files: ["test/**/*", "src/**/*", "!test/**/*.ts", "!src/**/*.ts"],
        tasks: ["copy:test", "copy:src"]
      },
      ts: {
        files: ["test/**/*.ts", "src/**/*.ts"],
        tasks: ["ts:fastCompile"]
      },
    }
  });

  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");  
  
  grunt.registerTask("build", ["ts:fullCompile"]);
  grunt.registerTask("buildAndWatch", ["build", "copy:src", "copy:test", "watch"]);  

};