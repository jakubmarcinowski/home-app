import { Injectable, Scope, Inject } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from './types/db';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  private clientInstance: SupabaseClient<Database>;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async getClient() {
    if (this.clientInstance) {
      return this.clientInstance;
    }
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(this.request);
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    this.clientInstance = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          persistSession: false,
        },
        global: {
          headers,
        },
      },
    );
    return this.clientInstance;
  }
}
