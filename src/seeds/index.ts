import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.info('🌱 Iniciando el seeding de la base de datos...');

  try {
    // Crear Países
    const country = await prisma.country.create({
      data: { name: 'Guatemala' },
    });

    // Crear Departamentos
    const department = await prisma.department.create({
      data: { name: 'Izabal', country_id: country.id_country },
    });

    // Crear Municipios
    const municipality = await prisma.municipality.create({
      data: { name: 'Livingston', department_id: department.id_department },
    });

    // Crear Tipos de Empresas
    const companyType = await prisma.companyType.create({
      data: { name: 'Tecnología' },
    });

    // Crear Empresas
    const company = await prisma.company.create({
      data: {
        legal_name: 'PDC Solutions',
        trade_name: 'TechCorp',
        nit: '123456789',
        country_id: country.id_country,
        department_id: department.id_department,
        municipality_id: municipality.id_municipality,
        company_type_id: companyType.id_company_type,
      },
    });

    // Crear Usuarios con contraseña hasheada
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await prisma.user.createMany({
      data: [
        {
          email: 'superadmin@example.com',
          name: 'Super Admin',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
        },
        {
          email: 'admin@example.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
        },
        {
          email: 'hr@example.com',
          name: 'HR User',
          password: hashedPassword,
          role: 'HR',
        },
      ],
    });

    console.info('🔑 Usuarios creados:', users);

    // Obtener el usuario SUPER_ADMIN
    const superAdmin = await prisma.user.findUnique({
      where: { email: 'superadmin@example.com' },
    });

    // Crear Empleados
    const employee = await prisma.employee.create({
      data: {
        name: 'John Doe',
        age: 30,
        email: 'johndoe@example.com',
      },
    });

    // Relación Empresa - Empleado (muchos a muchos)
    await prisma.employeeCompany.create({
      data: {
        employee_id: employee.id_employee,
        company_id: company.id_company,
      },
    });

    // Crear Sesión de usuario
    await prisma.session.create({
      data: {
        user_id: superAdmin!.id_user,
        token: 'random_token',
        refresh_token: 'random_refresh_token',
        expires_at: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // Expira en 7 días
      },
    });

    // Crear Logs
    await prisma.log.createMany({
      data: [
        {
          user_id: superAdmin!.id_user,
          table_name: 'User',
          action: 'CREATE',
          record_id: superAdmin!.id_user,
        },
        {
          user_id: superAdmin!.id_user,
          table_name: 'Company',
          action: 'CREATE',
          record_id: company.id_company,
        },
      ],
    });

    console.info('✅ Seeding completado con éxito.');
  } catch (error) {
    console.error('❌ Error en el seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}
