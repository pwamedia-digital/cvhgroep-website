import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

export const cmsAccessControl = createAccessControl(statement);

export const pwamediaAdminRole = cmsAccessControl.newRole({
  ...adminAc.statements,
});

export const klantbeheerderRole = cmsAccessControl.newRole({});

