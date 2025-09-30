// src/db-health.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DbHealthService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      // Ping the database
      await this.dataSource.query('SELECT 1');
      console.log('Database connection works');
    } catch (err) {
      console.error('Database connection failed:', err);
    }
  }
}

