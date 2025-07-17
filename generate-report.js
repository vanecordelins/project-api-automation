
const reporter = require('cucumber-html-reporter');

const options = {
  theme: 'bootstrap',
  jsonFile: 'cucumber_report.json',
  output: 'cucumber_report.html',
  reportSuiteAsScenarios: true,
  launchReport: false,
  metadata: {
    "Project": "Serverest API Testes",
    "Executor": "GitHub Actions / Local",
    "Ambiente": "Staging"
  }
};

reporter.generate(options);
