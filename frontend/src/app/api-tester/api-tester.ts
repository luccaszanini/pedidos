import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface HeaderRow {
  key: string;
  value: string;
}

@Component({
  selector: 'app-api-tester',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './api-tester.html',
  styleUrl: './api-tester.css',
})
export class ApiTester {
  // Troque aqui pela URL do backend (ex: túnel do docker local)
  baseUrl = signal('http://localhost:5000');
  path = signal('/api/pedidos');
  method = signal<HttpMethod>('GET');
  body = signal('');
  headers = signal<HeaderRow[]>([{ key: 'Content-Type', value: 'application/json' }]);

  loading = signal(false);
  status = signal<number | null>(null);
  statusText = signal('');
  responseBody = signal('');
  errorMessage = signal('');
  elapsedMs = signal<number | null>(null);

  methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  constructor(private http: HttpClient) {}

  addHeader() {
    this.headers.update((rows) => [...rows, { key: '', value: '' }]);
  }

  removeHeader(index: number) {
    this.headers.update((rows) => rows.filter((_, i) => i !== index));
  }

  private buildHeaders(): HttpHeaders {
    let httpHeaders = new HttpHeaders();
    for (const row of this.headers()) {
      if (row.key.trim()) {
        httpHeaders = httpHeaders.set(row.key.trim(), row.value);
      }
    }
    return httpHeaders;
  }

  private get fullUrl(): string {
    const base = this.baseUrl().replace(/\/+$/, '');
    const p = this.path().startsWith('/') ? this.path() : `/${this.path()}`;
    return `${base}${p}`;
  }

  async send() {
    this.loading.set(true);
    this.status.set(null);
    this.statusText.set('');
    this.responseBody.set('');
    this.errorMessage.set('');
    this.elapsedMs.set(null);

    const start = performance.now();
    const httpHeaders = this.buildHeaders();
    const url = this.fullUrl;
    const m = this.method();

    let parsedBody: unknown = undefined;
    if (m !== 'GET' && m !== 'DELETE' && this.body().trim()) {
      try {
        parsedBody = JSON.parse(this.body());
      } catch {
        parsedBody = this.body();
      }
    }

    try {
      const response$ = this.http.request(m, url, {
        headers: httpHeaders,
        body: parsedBody,
        observe: 'response',
      });
      const response = await firstValueFrom(response$);
      this.status.set(response.status);
      this.statusText.set(response.statusText);
      this.responseBody.set(this.formatBody(response.body));
    } catch (err: any) {
      this.status.set(err?.status ?? null);
      this.statusText.set(err?.statusText ?? '');
      this.errorMessage.set(err?.message ?? 'Falha na requisição');
      if (err?.error) {
        this.responseBody.set(this.formatBody(err.error));
      }
    } finally {
      this.elapsedMs.set(Math.round(performance.now() - start));
      this.loading.set(false);
    }
  }

  private formatBody(body: unknown): string {
    if (body === null || body === undefined) return '';
    if (typeof body === 'string') return body;
    try {
      return JSON.stringify(body, null, 2);
    } catch {
      return String(body);
    }
  }
}