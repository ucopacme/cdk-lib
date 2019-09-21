import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');

export interface IGroupProps {
  name: string;
}

export class AdminGroup extends cdk.Construct {
  public readonly group: iam.Group;
  public readonly role: iam.Role;
  constructor(parent: cdk.Construct, name: string, props: IGroupProps) {
    super(parent, name);

    // create workflow role

    const workFlowRole = new iam.Role(this, 'workFlowRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
    });
    this.role = workFlowRole;

    // add manage glue service role

    workFlowRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'));

    // create and add inline policy for lake formation

    const lakeFormationPolicy = new iam.PolicyStatement({
      actions: ['lakeformation:GetDataAccess', 'lakeformation:GrantPermissions'],
      effect: iam.Effect.ALLOW,
      resources: ['*'],
    });
    workFlowRole.addToPolicy(lakeFormationPolicy);

    // create and add inline policy to assume role

    const workFlowAssumePolicy = new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      effect: iam.Effect.ALLOW,
      resources: [workFlowRole.roleArn],
    });
    workFlowRole.addToPolicy(workFlowAssumePolicy);

    // create admin policy statement
    const AdminDatalakeBasicPolicyStatement = new iam.PolicyStatement({
      actions: [
        'lakeformation:*',
        'cloudtrail:DescribeTrails',
        'cloudtrail:LookupEvents',
        'iam:PutRolePolicy',
        'iam:CreateServiceLinkedRole',
      ],
      effect: iam.Effect.ALLOW,
      resources: ['*'],
    });
    const AdminDatalakeNoPutPolicyStatement = new iam.PolicyStatement({
      actions: ['lakeformation:PutDataLakeSettings'],
      effect: iam.Effect.DENY,
      resources: ['*'],
    });
    const AdminDatalakePassRolePolicyStatement = new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      effect: iam.Effect.ALLOW,
      resources: [workFlowRole.roleArn],
    });
    const group = new iam.Group(this, props.name, {});
    this.group = group;
    group.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSGlueConsoleFullAccess'));
    group.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAthenaFullAccess'));
    group.addToPolicy(AdminDatalakeBasicPolicyStatement);
    group.addToPolicy(AdminDatalakeNoPutPolicyStatement);
    group.addToPolicy(AdminDatalakePassRolePolicyStatement);
  }
}