import UserModel from '../models/User';

export const seedAdmin = async (): Promise<void> => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mail.com';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    if (!existingAdmin) {
      console.log('Database Seeding: No admin user detected. Seeding default Admin account...');

      const newAdmin = new UserModel({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        interests: ['coding', 'security']
      });

      await newAdmin.save();
      console.log(`[SEED] Admin user seeded successfully!`);
      console.log(`[SEED] Username: ${adminUsername}`);
      console.log(`[SEED] Email: ${adminEmail}`);
      console.log(`[SEED] Password: ${adminPassword}`);
    } else {
      console.log(`Database Seeding: Admin user already exists (${existingAdmin.email}). Skipping seed.`);
    }
  } catch (error: any) {
    console.error(`[SEED ERR] Error seeding admin user: ${error.message}`);
  }
};
