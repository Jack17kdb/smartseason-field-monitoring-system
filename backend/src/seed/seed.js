import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Field from '../models/fieldModel.js';

dotenv.config();

const agents = [
  { username: 'kamau_peter',  email: 'kamau@ssfms.dev',  password: 'agent123' },
  { username: 'wanjiru_grace', email: 'wanjiru@ssfms.dev', password: 'agent123' },
  { username: 'odhiambo_ken', email: 'odhiambo@ssfms.dev', password: 'agent123' },
];

const fieldTemplates = [
  { name: 'North Paddock A',   cropType: 'Maize',    plantingDate: new Date('2025-01-10'), currentStage: 'growing',   status: 'active'    },
  { name: 'South Ridge B',     cropType: 'Wheat',    plantingDate: new Date('2025-01-18'), currentStage: 'planted',   status: 'active'    },
  { name: 'Eastern Lowlands',  cropType: 'Soybean',  plantingDate: new Date('2024-10-05'), currentStage: 'harvested', status: 'completed' },
  { name: 'Central Plot 3',    cropType: 'Sorghum',  plantingDate: new Date('2025-02-01'), currentStage: 'planted',   status: 'active'    },
  { name: 'Hillside Terrace',  cropType: 'Barley',   plantingDate: new Date('2025-01-25'), currentStage: 'growing',   status: 'at risk'   },
  { name: 'Western Flats',     cropType: 'Maize',    plantingDate: new Date('2024-11-12'), currentStage: 'ready',     status: 'active'    },
  { name: 'Riverside Strip',   cropType: 'Rice',     plantingDate: new Date('2025-02-14'), currentStage: 'planted',   status: 'active'    },
  { name: 'Upper Valley C',    cropType: 'Cassava',  plantingDate: new Date('2024-09-20'), currentStage: 'harvested', status: 'completed' },
  { name: 'Dry Creek Field',   cropType: 'Millet',   plantingDate: new Date('2025-01-30'), currentStage: 'growing',   status: 'at risk'   },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to database');

  const existingAgents = await User.find({ username: { $in: agents.map(a => a.username) } });
  if (existingAgents.length > 0) {
    console.log('Seed agents already exist, skipping user creation.');
  }

  const createdAgents = [];

  for (const agent of agents) {
    const exists = await User.findOne({ username: agent.username });
    if (exists) {
      createdAgents.push(exists);
      console.log(`User ${agent.username} already exists, skipping.`);
      continue;
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(agent.password, salt);
    const newUser = await User.create({ username: agent.username, email: agent.email, password: hash, role: 'agent' });
    createdAgents.push(newUser);
    console.log(`Created agent: ${newUser.username}`);
  }

  let fieldsCreated = 0;
  for (let i = 0; i < fieldTemplates.length; i++) {
    const template = fieldTemplates[i];
    const agent = createdAgents[i % createdAgents.length];

    const exists = await Field.findOne({ name: template.name });
    if (exists) {
      console.log(`Field "${template.name}" already exists, skipping.`);
      continue;
    }

    await Field.create({ ...template, assignedTo: agent._id });
    console.log(`Created field: "${template.name}" → assigned to ${agent.username}`);
    fieldsCreated++;
  }

  console.log(`\nSeed complete. ${fieldsCreated} field(s) created across ${createdAgents.length} agent(s).`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
