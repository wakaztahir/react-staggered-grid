const ghpages = require("gh-pages")

ghpages.publish('build', {
    branch: 'gh-pages',
    repo: 'https://github.com/wakaztahir/react-staggered-grid.git'
}, () => {
    console.log("Package Github Pages published")
});