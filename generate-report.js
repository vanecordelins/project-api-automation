import reporter from 'cucumber-html-reporter';

const options = {
  theme: 'bootstrap',
  jsonFile: 'cucumber_report.json',
  output: 'cucumber_report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    "App Version":"1.0.0",
    "Test Environment": "STAGING",
    "Browser": "N/A",
    "Platform": process.platform,
    "Parallel": "Scenarios",
    "Executed": "GitHub Actions"
  }
};

reporter.generate(options);
