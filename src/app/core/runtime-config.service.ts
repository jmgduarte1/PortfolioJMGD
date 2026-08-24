import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface RuntimeConfig {
  contactApiUrl: string;
  turnstileSiteKey: string;
}

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private readonly http = inject(HttpClient);
  private config: RuntimeConfig | undefined;

  async load(): Promise<void> {
    this.config = await firstValueFrom(this.http.get<RuntimeConfig>('/app-config.json'));
    if (!this.config.contactApiUrl || !this.config.turnstileSiteKey) {
      throw new Error('Public runtime configuration is incomplete.');
    }
  }

  get value(): RuntimeConfig {
    if (!this.config) throw new Error('Public runtime configuration has not loaded.');
    return this.config;
  }
}
