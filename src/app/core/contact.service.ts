import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from './runtime-config.service';

export interface ContactRequest {
  name: string;
  email: string;
  company?: string;
  message: string;
  turnstileToken: string;
  website: string;
}

interface ContactResponse { ok: boolean; message: string; }

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);

  submit(request: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.runtimeConfig.value.contactApiUrl, request);
  }
}
