import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import lakeformationAnalystGroup = require('../lib/lakeformationAnalystGroup');
import util = require('../lib/util');
import params from './config.json';
import sampleLakeformationAdminGroup from './sample-lakeformation-admin-group.json';

const branchEnv = util.mapBranchToEnvironment().trim();

const baseprops = {
  application: 'sptn',
  buildId: 'nope',
  createdBy: 'Xerxes',
  description: 'Stop Plate Tectonics Now',
  environment: branchEnv,
  label: 'LakeAdmins',
  group: 'alfred smithee',
  source: 'git',
};

test('Analyst Group Created', () => {
  // WHEN
  const app = new cdk.App();
  util.tagApp(app, { baseprops });
  const stack = new util.BaseStack(app, { baseprops });
  const myAnalystGroup = new lakeformationAnalystGroup.LakeformationAnalystGroup(stack, { baseprops });
  // THEN
  expectCDK(stack).to(haveResource('AWS::IAM::Group'));
});
