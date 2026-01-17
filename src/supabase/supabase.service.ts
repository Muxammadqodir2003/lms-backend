import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private readonly supabaseUrl: string;
  private readonly supabaseKey: string;

  constructor(private readonly configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_PROJECT_URL');
    this.supabaseKey = this.configService.get<string>('SUPABASE_SECRET_KEY');
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async uploadVideo(file: Express.Multer.File) {
    const fileBuffer = fs.readFileSync(file.path);
    const fileName = `${Date.now()}-${file.originalname}`;

    const { data, error } = await this.supabase.storage
      .from('lessons-videos')
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrl } = this.supabase.storage
      .from('lessons-videos')
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  }

  async uploadImage(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data, error } = await this.supabase.storage
      .from('courses-image')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrl } = this.supabase.storage
      .from('courses-image')
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  }

  async deleteVideo(fileUrl: string) {
    const parts = fileUrl.split('/');
    const fileName = parts[parts.length - 1];

    const { error } = await this.supabase.storage
      .from('lessons-videos')
      .remove([fileName]);

    if (error) throw error;
  }

  async deleteImage(fileUrl: string) {
    const parts = fileUrl.split('/');
    const fileName = parts[parts.length - 1];

    const { error } = await this.supabase.storage
      .from('courses-image')
      .remove([fileName]);

    if (error) throw error;
  }
}
