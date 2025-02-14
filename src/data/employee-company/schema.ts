import { z } from '@hono/zod-openapi';

export const employeeCompanySchemaObject = {
  id_employee_company: z.string().uuid(),
  employee_id: z.string().uuid(),
  company_id: z.string().uuid(),
  start_date: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  end_date: z.string().datetime().nullable().optional().openapi({ example: null }),
};

export const employeeCompanySchema = z.object(employeeCompanySchemaObject);
export const employeeCompanySchemaOpenApi = employeeCompanySchema.openapi('EmployeeCompany');
export const employeeCompanySchemaFields = z.enum(
  Object.keys(employeeCompanySchemaObject) as [string, ...string[]]
);

export type EmployeeCompany = z.infer<typeof employeeCompanySchema>;
export type CreateEmployeeCompany = Omit<EmployeeCompany, 'id_employee_company'>;
export type UpdateEmployeeCompany = Partial<Omit<EmployeeCompany, 'id_employee_company'>>;
