import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable, of, catchError } from 'rxjs';
import {
  About,
  Certification,
  ContactSubmission,
  ExperienceItem,
  ExpertiseArea,
  Hero,
  NavigationItem,
  PortfolioContent,
  Profile,
  Project,
  SeoContent,
} from '../models/portfolio-content';
import { ContentRepository } from './content-repository';
import { fallbackContent } from './fallback-content';

const API_BASE_URL = 'http://localhost:3000';

interface SkillRecord {
  id: number;
  name: string;
}

@Injectable()
export class JsonServerContentRepository extends ContentRepository {
  private readonly http = inject(HttpClient);

  override getContent(): Observable<PortfolioContent> {
    return forkJoin({
      profile: this.http.get<Profile>(`${API_BASE_URL}/profile`),
      navigation: this.http.get<NavigationItem[]>(`${API_BASE_URL}/navigation`),
      hero: this.http.get<Hero>(`${API_BASE_URL}/hero`),
      about: this.http.get<About>(`${API_BASE_URL}/about`),
      expertiseAreas: this.http.get<ExpertiseArea[]>(`${API_BASE_URL}/expertiseAreas`),
      skills: this.http
        .get<SkillRecord[]>(`${API_BASE_URL}/skills`)
        .pipe(map((skills) => skills.map((skill) => skill.name))),
      projects: this.http.get<Project[]>(`${API_BASE_URL}/projects`),
      experience: this.http.get<ExperienceItem[]>(`${API_BASE_URL}/experience`),
      certifications: this.http.get<Certification[]>(`${API_BASE_URL}/certifications`),
      seo: this.http.get<SeoContent>(`${API_BASE_URL}/seo`),
    }).pipe(catchError(() => of(fallbackContent)));
  }

  override getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_BASE_URL}/projects`).pipe(
      catchError(() => of(fallbackContent.projects)),
    );
  }

  override getExperience(): Observable<ExperienceItem[]> {
    return this.http.get<ExperienceItem[]>(`${API_BASE_URL}/experience`).pipe(
      catchError(() => of(fallbackContent.experience)),
    );
  }

  override getCertifications(): Observable<Certification[]> {
    return this.http.get<Certification[]>(`${API_BASE_URL}/certifications`).pipe(
      catchError(() => of(fallbackContent.certifications)),
    );
  }

  override submitContact(submission: ContactSubmission): Observable<ContactSubmission> {
    return this.http
      .post<ContactSubmission>(`${API_BASE_URL}/contactSubmissions`, submission)
      .pipe(map((savedSubmission) => savedSubmission));
  }
}
