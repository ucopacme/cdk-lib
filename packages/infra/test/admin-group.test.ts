import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import lakeformationAdminGroup = require('../lib/lakeformationAdminGroup');
import util = require('../lib/util');
import params from './config.json';
import sampleLakeformationAdminGroup from './sample-lakeformation-admin-group.json';

const branchEnv = util.mapBranchToEnvironment().trim();

const baseprops = {
  application: 'sptn',
  buildId: 'nope',
  description: 'Stop Plate Tectonics Now',
  environment: branchEnv,
  label: 'LakeAdmins',
  group: 'Monty Python',
  source: 'git',
};

test('Admin Group Created', () => {
  // WHEN
  const app = new cdk.App();
  util.tagApp(app, { baseprops });
  const stack = new util.BaseStack(app, { baseprops });
  const myAdminGroup = new lakeformationAdminGroup.LakeformationAdminGroup(stack, { baseprops });
  // THEN
  expectCDK(stack).toMatch(sampleLakeformationAdminGroup.junk2);
  expectCDK(stack).to(haveResource('AWS::IAM::Group'));
});
