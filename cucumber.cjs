module.exports = {
  default: {
    paths: ["tests/bdd/features/**/*.feature"],
    requireModule: ["ts-node/register"],
    require: ["tests/bdd/support/**/*.ts", "tests/bdd/steps/**/*.ts"],
    format: ["progress", "allure-cucumberjs/reporter"],
    formatOptions: { resultsDir: "allure-results" },
    retry: 1,
    parallel: 1,
  },
}