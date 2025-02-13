import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log("🌱 Iniciando el seeding de la base de datos...");

  try {
    // Crear Países
    const country = await prisma.country.create({
      data: {
        name: "Guatemala",
      },
    });

    // Crear Departamentos
    const department = await prisma.department.create({
      data: {
        name: "IZABAL",
        country_id: country.id_country,
      },
    });

    // Crear Municipios
    const municipality = await prisma.municipality.create({
      data: {
        name: "Livingston",
        department_id: department.id_department,
      },
    });

    // Crear Empresas
    const company = await prisma.company.create({
      data: {
        name: "PDC Solutions",
        trade_name: "TechCorp",
        nit: "123456789",
        phone: "555-1234",
        email: "info@techcorp.com",
        country_id: country.id_country,
        department_id: department.id_department,
        municipality_id: municipality.id_municipality,
      },
    });

    // Crear Usuarios con contraseña hasheada
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    // Crear Empleados
    const employee = await prisma.employee.create({
      data: {
        name: "John Doe",
        age: 30,
        phone: "555-5678",
        email: "johndoe@example.com",
        company_id: company.id_company,
      },
    });

    // Crear Sesión
    await prisma.session.create({
      data: {
        user_id: user.id_user,
        token: "random_token",
        refresh_token: "random_refresh_token",
        expires_at: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 días de expiración
      },
    });

    // Crear Logs
    await prisma.log.createMany({
      data: [
        {
          user_id: user.id_user,
          table_name: "User",
          action: "CREATE",
          record_id: user.id_user,
        },
        {
          user_id: user.id_user,
          table_name: "Company",
          action: "CREATE",
          record_id: company.id_company,
        },
      ],
    });

    console.log("✅ Seeding completado con éxito.");
  } catch (error) {
    console.error("❌ Error en el seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}
