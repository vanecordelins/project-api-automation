const reporter = require('cucumber-html-reporter');
reporter.generate({
  theme: 'bootstrap',
  jsonFile: 'cucumber_report.json',
  output: './reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  launchReport: false,
});
