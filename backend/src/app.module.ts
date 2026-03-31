import { TypeOrmModule } from '@nestjs/typeorm';

TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'raone',
  autoLoadEntities: true,
  synchronize: true,
});