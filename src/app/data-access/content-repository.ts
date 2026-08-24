import { Observable } from 'rxjs';
import {
  Certification,
  ExperienceItem,
  PortfolioContent,
  Project,
} from '../models/portfolio-content';

export abstract class ContentRepository {
  abstract getContent(): Observable<PortfolioContent>;
  abstract getProjects(): Observable<Project[]>;
  abstract getExperience(): Observable<ExperienceItem[]>;
  abstract getCertifications(): Observable<Certification[]>;
}
