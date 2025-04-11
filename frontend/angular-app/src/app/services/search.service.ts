import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = '/api/search'; // Update with your actual API endpoint

  constructor(private http: HttpClient) {}

  searchCourses(query: string): Observable<any[]> {
    if (!query.trim()) {
      return of([]);
    }
    
    return this.http.get<any[]>(`${this.apiUrl}?q=${encodeURIComponent(query)}`).pipe(
      map(results => results || []), // Ensure we always return an array
      catchError(() => of([])) // Return empty array on error
    );
  }
}