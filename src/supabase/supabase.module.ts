import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SupabaseStrategy } from './supabase.strategy';
import { SupabaseGuard } from './supabase.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [SupabaseService, SupabaseStrategy, SupabaseGuard],
  imports: [PassportModule],
  exports: [SupabaseService, SupabaseGuard],
})
export class SupabaseModule {}
